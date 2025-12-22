-- Insert Super Admin (Tenant ID is NULL)
INSERT INTO users (email, password_hash, full_name, role, tenant_id)
VALUES ('superadmin@system.com', '$2b$10$YourHashedPasswordHere', 'System Super Admin', 'super_admin', NULL)
ON CONFLICT DO NOTHING;

-- Insert Demo Tenant
INSERT INTO tenants (name, subdomain, status, subscription_plan)
VALUES ('Demo Company', 'demo', 'active', 'pro');

-- Insert Tenant Admin (Dynamic ID fetching would be done in app logic, this is just SQL illustration)
-- NOTE: In production, seeding is usually done via a script to handle UUIDs correctly.
