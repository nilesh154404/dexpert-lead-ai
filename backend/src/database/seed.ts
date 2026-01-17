import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Lead } from '../entities/lead.entity';
import { Appointment } from '../entities/appointment.entity';
import { Conversation } from '../entities/conversation.entity';
import { LeadInsight } from '../entities/lead-insight.entity';
import { Message } from '../entities/message.entity';
import { AutomationRule } from '../entities/automation-rule.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, PermissionModule, PermissionAction } from '../entities/permission.entity';
import { UserRole, UserStatus } from '../entities/user.entity';
import { LeadStatus } from '../entities/lead.entity';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'nilesh', // Match default from database-config.service.ts
    database: process.env.DB_DATABASE || 'kindred_lead_ai',
    entities: [
      User,
      Tenant,
      Lead,
      Appointment,
      Conversation,
      LeadInsight,
      Message,
      AutomationRule,
      Role,
      Permission,
    ],
    synchronize: false,
  });

  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const leadRepository = AppDataSource.getRepository(Lead);
  const appointmentRepository = AppDataSource.getRepository(Appointment);
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const leadInsightRepository = AppDataSource.getRepository(LeadInsight);
  const messageRepository = AppDataSource.getRepository(Message);
  const automationRuleRepository = AppDataSource.getRepository(AutomationRule);
  const permissionRepository = AppDataSource.getRepository(Permission);
  const roleRepository = AppDataSource.getRepository(Role);

  // Clear existing data (optional - comment out if you want to preserve data)
  // Temporarily disable foreign key checks to allow truncation
  console.log('Clearing existing data...');
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
  
  await messageRepository.clear();
  await appointmentRepository.clear();
  await leadInsightRepository.clear();
  await conversationRepository.clear();
  await leadRepository.clear();
  await automationRuleRepository.clear();
  await userRepository.clear();
  
  // Clear junction table for role_permissions
  await AppDataSource.query('DELETE FROM role_permissions');
  
  await roleRepository.clear();
  await permissionRepository.clear();
  await tenantRepository.clear();
  
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('✓ Existing data cleared');

  // Create Permissions for all modules
  console.log('Creating permissions...');
  const modules = [
    PermissionModule.STAFF,
    PermissionModule.LEADS,
    PermissionModule.APPOINTMENTS,
    PermissionModule.ROLES,
    PermissionModule.TENANTS,
    PermissionModule.ANALYTICS,
    PermissionModule.CONVERSATIONS,
    PermissionModule.AI_CONFIG,
    PermissionModule.BRANDING,
  ];

  const actions = [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
    PermissionAction.MANAGE,
  ];

  const permissions: Permission[] = [];
  for (const module of modules) {
    for (const action of actions) {
      const permission = permissionRepository.create({
        name: `${module}:${action}`,
        module,
        action,
        description: `${action} permission for ${module} module`,
      });
      const saved = await permissionRepository.save(permission);
      permissions.push(saved);
    }
  }
  console.log(`✓ Created ${permissions.length} permissions`);

  // Create System Roles
  console.log('Creating system roles...');
  
  // SuperAdmin Role - All permissions
  const superAdminRole = roleRepository.create({
    name: 'SuperAdmin',
    description: 'System administrator with full access to all modules and tenants',
    roleType: RoleType.SYSTEM,
    tenantId: null,
    isActive: true,
    permissions: permissions, // All permissions
  });
  const savedSuperAdminRole = await roleRepository.save(superAdminRole);
  console.log('✓ SuperAdmin role created with all permissions');

  // OrgAdmin Role - Organization-level permissions (excluding tenant management)
  const orgAdminPermissions = permissions.filter(
    (p) => p.module !== PermissionModule.TENANTS || p.action === PermissionAction.READ,
  );
  const orgAdminRole = roleRepository.create({
    name: 'OrgAdmin',
    description: 'Organization administrator with full access to organization data',
    roleType: RoleType.SYSTEM,
    tenantId: null,
    isActive: true,
    permissions: orgAdminPermissions,
  });
  const savedOrgAdminRole = await roleRepository.save(orgAdminRole);
  console.log('✓ OrgAdmin role created');

  // Staff Role - Limited permissions (read own, create/update own)
  const staffPermissions = permissions.filter(
    (p) =>
      (p.module === PermissionModule.LEADS ||
        p.module === PermissionModule.APPOINTMENTS ||
        p.module === PermissionModule.CONVERSATIONS) &&
      (p.action === PermissionAction.READ || p.action === PermissionAction.CREATE || p.action === PermissionAction.UPDATE),
  );
  const staffRole = roleRepository.create({
    name: 'Staff',
    description: 'Staff member with access to assigned leads and appointments',
    roleType: RoleType.SYSTEM,
    tenantId: null,
    isActive: true,
    permissions: staffPermissions,
  });
  const savedStaffRole = await roleRepository.save(staffRole);
  console.log('✓ Staff role created');

  // Create System Tenant (for Super Admin)
  const systemTenant = tenantRepository.create({
    id: 'system',
    name: 'System',
    primaryColor: '0 0% 50%',
    accentColor: '0 0% 70%',
    fontFamily: 'Inter',
    welcomeMessage: 'System Administration',
    chatbotName: 'System',
    tenantSecret: null, // System tenant doesn't need a secret
  });
  await tenantRepository.save(systemTenant);
  console.log('✓ System tenant created');

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const superAdmin = userRepository.create({
    name: 'Super Admin',
    email: 'superadmin@kindred.com',
    password: superAdminPassword,
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    tenantId: 'system', // Super admin uses system tenant
    department: 'System',
    roleId: savedSuperAdminRole.id,
  });
  await userRepository.save(superAdmin);
  console.log('✓ Super Admin created: superadmin@kindred.com / superadmin123');

  // Create Organisation 1 - TechCorp
  const org1Secret = crypto.randomBytes(32).toString('hex');
  const org1 = tenantRepository.create({
    id: 'org-techcorp',
    name: 'TechCorp Solutions',
    primaryColor: '240 60% 50%',
    accentColor: '280 80% 60%',
    fontFamily: 'Inter',
    welcomeMessage: 'Welcome to TechCorp! How can we help you today?',
    chatbotName: 'TechBot',
    tenantSecret: org1Secret,
  });
  await tenantRepository.save(org1);
  console.log('✓ Organisation 1 created: TechCorp Solutions');
  console.log(`  Tenant Secret: ${org1Secret}`);

  // Create Organisation 2 - GreenLeaf
  const org2Secret = crypto.randomBytes(32).toString('hex');
  const org2 = tenantRepository.create({
    id: 'org-greenleaf',
    name: 'GreenLeaf Health',
    primaryColor: '152 60% 35%',
    accentColor: '152 80% 45%',
    fontFamily: 'Inter',
    welcomeMessage: 'Hello! I\'m here to help with your healthcare needs.',
    chatbotName: 'HealthGuide',
    tenantSecret: org2Secret,
  });
  await tenantRepository.save(org2);
  console.log('✓ Organisation 2 created: GreenLeaf Health');
  console.log(`  Tenant Secret: ${org2Secret}`);

  // Create Organisation Admin for TechCorp
  const org1AdminPassword = await bcrypt.hash('admin123', 10);
  const org1Admin = userRepository.create({
    name: 'John Doe',
    email: 'john@techcorp.com',
    password: org1AdminPassword,
    role: UserRole.ORGANISATION,
    status: UserStatus.ACTIVE,
    tenantId: org1.id,
    department: 'Management',
    roleId: savedOrgAdminRole.id,
  });
  await userRepository.save(org1Admin);
  console.log('✓ Org Admin created: john@techcorp.com / admin123');

  // Create Staff for TechCorp
  const techcorpStaff = [
    { name: 'Jane Smith', email: 'jane@techcorp.com', role: UserRole.SALES, department: 'Sales' },
    { name: 'Mike Johnson', email: 'mike@techcorp.com', role: UserRole.MANAGER, department: 'Sales' },
    { name: 'Sarah Williams', email: 'sarah@techcorp.com', role: UserRole.SUPPORT, department: 'Support' },
  ];

  for (const staff of techcorpStaff) {
    const password = await bcrypt.hash('staff123', 10);
    const user = userRepository.create({
      ...staff,
      password,
      status: UserStatus.ACTIVE,
      tenantId: org1.id,
      roleId: savedStaffRole.id,
    });
    await userRepository.save(user);
    console.log(`✓ Staff created: ${staff.email} / staff123`);
  }

  // Create Organisation Admin for GreenLeaf
  const org2AdminPassword = await bcrypt.hash('admin123', 10);
  const org2Admin = userRepository.create({
    name: 'Emily Chen',
    email: 'emily@greenleaf.com',
    password: org2AdminPassword,
    role: UserRole.ORGANISATION,
    status: UserStatus.ACTIVE,
    tenantId: org2.id,
    department: 'Management',
    roleId: savedOrgAdminRole.id,
  });
  await userRepository.save(org2Admin);
  console.log('✓ Org Admin created: emily@greenleaf.com / admin123');

  // Create Staff for GreenLeaf
  const greenleafStaff = [
    { name: 'David Brown', email: 'david@greenleaf.com', role: UserRole.SALES, department: 'Sales' },
    { name: 'Lisa Park', email: 'lisa@greenleaf.com', role: UserRole.MANAGER, department: 'Sales' },
  ];

  for (const staff of greenleafStaff) {
    const password = await bcrypt.hash('staff123', 10);
    const user = userRepository.create({
      ...staff,
      password,
      status: UserStatus.ACTIVE,
      tenantId: org2.id,
      roleId: savedStaffRole.id,
    });
    await userRepository.save(user);
    console.log(`✓ Staff created: ${staff.email} / staff123`);
  }

  // Create Sample Leads for TechCorp
  const techcorpLeads = [
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc',
      role: 'VP of Operations',
      status: LeadStatus.QUALIFIED,
      intentScore: 92,
      source: 'AI Chatbot',
      aiSummary: 'Ready to buy. Has asked about pricing twice and requested a demo.',
    },
    {
      name: 'Michael Roberts',
      email: 'm.roberts@example.com',
      company: 'Global Services',
      status: LeadStatus.NURTURING,
      intentScore: 74,
      source: 'AI Chatbot',
      aiSummary: 'Comparing with competitors. Interested but needs more information.',
    },
    {
      name: 'Emily Watson',
      email: 'emily.w@example.com',
      status: LeadStatus.NEW,
      intentScore: 84,
      source: 'AI Chatbot',
      aiSummary: 'High engagement in first conversation. Budget confirmed.',
    },
  ];

  for (const leadData of techcorpLeads) {
    const lead = leadRepository.create({
      ...leadData,
      tenantId: org1.id,
      lastInteractionAt: new Date(),
    });
    await leadRepository.save(lead);
  }
  console.log(`✓ Created ${techcorpLeads.length} leads for TechCorp`);

  // Create Sample Leads for GreenLeaf
  const greenleafLeads = [
    {
      name: 'James Miller',
      email: 'james@healthco.com',
      phone: '+1 (555) 987-6543',
      company: 'HealthCo',
      status: LeadStatus.QUALIFIED,
      intentScore: 88,
      source: 'AI Chatbot',
      aiSummary: 'Interested in enterprise health solutions. Decision maker.',
    },
    {
      name: 'Anna Taylor',
      email: 'anna@medgroup.com',
      status: LeadStatus.NEW,
      intentScore: 76,
      source: 'AI Chatbot',
      aiSummary: 'Initial inquiry about patient management features.',
    },
  ];

  for (const leadData of greenleafLeads) {
    const lead = leadRepository.create({
      ...leadData,
      tenantId: org2.id,
      lastInteractionAt: new Date(),
    });
    await leadRepository.save(lead);
  }
  console.log(`✓ Created ${greenleafLeads.length} leads for GreenLeaf`);

  console.log('\n✅ Seeding completed!');
  console.log('\n📝 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('Super Admin:');
  console.log('  Email: superadmin@kindred.com');
  console.log('  Password: superadmin123');
  console.log('');
  console.log('Org Admin (TechCorp):');
  console.log('  Email: john@techcorp.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Org Admin (GreenLeaf):');
  console.log('  Email: emily@greenleaf.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Staff Users (all use password: staff123):');
  console.log('  - jane@techcorp.com (Sales)');
  console.log('  - mike@techcorp.com (Manager)');
  console.log('  - sarah@techcorp.com (Support)');
  console.log('  - david@greenleaf.com (Sales)');
  console.log('  - lisa@greenleaf.com (Manager)');
  console.log('─────────────────────────────────────────');
  console.log('\n🔑 Tenant Secrets (for API integration):');
  console.log('─────────────────────────────────────────');
  console.log(`TechCorp: ${org1Secret}`);
  console.log(`GreenLeaf: ${org2Secret}`);
  console.log('─────────────────────────────────────────');
  console.log('\n💡 Use these secrets with POST /api/v1/auth/exchange');

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
