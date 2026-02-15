alter table public.users add column if not exists is_admin boolean default false;
alter table public.users add column if not exists admin_role text check (admin_role in ('super_admin', 'admin', 'content_manager', 'viewer'));

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.users(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb,
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  content_type text check (content_type in ('blog_post', 'guide', 'faq', 'page')),
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  featured_image_url text,
  author_id uuid references public.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_admin_activity_logs_updated_at
before update on public.admin_activity_logs
for each row execute function public.set_updated_at();

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create trigger set_content_updated_at
before update on public.content
for each row execute function public.set_updated_at();

alter table public.admin_activity_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.content enable row level security;

create policy admin_activity_logs_select_admin
on public.admin_activity_logs
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy admin_activity_logs_insert_admin
on public.admin_activity_logs
for insert
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy admin_activity_logs_update_admin
on public.admin_activity_logs
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy admin_activity_logs_delete_admin
on public.admin_activity_logs
for delete
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy site_settings_select_admin
on public.site_settings
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy site_settings_insert_admin
on public.site_settings
for insert
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy site_settings_update_admin
on public.site_settings
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy site_settings_delete_admin
on public.site_settings
for delete
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy content_select_admin
on public.content
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy content_insert_admin
on public.content
for insert
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy content_update_admin
on public.content
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy content_delete_admin
on public.content
for delete
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
