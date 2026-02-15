create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_phone_format check (
    phone is null or phone ~ '^(\\+234|0)[0-9]{10}$'
  )
);

create table if not exists public.hearing_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  age integer,
  noise_exposure_hours integer,
  difficulty_hearing boolean,
  tinnitus boolean,
  family_history boolean,
  risk_level text check (risk_level in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  stock_quantity integer not null default 0,
  image_url text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_items_user_product_unique unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  total_amount numeric(10, 2) not null,
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_reference text,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_hearing_assessments_updated_at
before update on public.hearing_assessments
for each row execute function public.set_updated_at();

create trigger set_consultations_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_cart_items_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger set_order_items_updated_at
before update on public.order_items
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.hearing_assessments enable row level security;
alter table public.consultations enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy users_select_own
on public.users
for select
using (id = auth.uid());

create policy users_insert_own
on public.users
for insert
with check (id = auth.uid());

create policy users_update_own
on public.users
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy users_delete_own
on public.users
for delete
using (id = auth.uid());

create policy hearing_assessments_select_own
on public.hearing_assessments
for select
using (user_id = auth.uid());

create policy hearing_assessments_insert_own
on public.hearing_assessments
for insert
with check (user_id = auth.uid());

create policy hearing_assessments_update_own
on public.hearing_assessments
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy hearing_assessments_delete_own
on public.hearing_assessments
for delete
using (user_id = auth.uid());

create policy consultations_select_own
on public.consultations
for select
using (user_id = auth.uid());

create policy consultations_insert_own
on public.consultations
for insert
with check (user_id = auth.uid());

create policy consultations_update_own
on public.consultations
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy consultations_delete_own
on public.consultations
for delete
using (user_id = auth.uid());

create policy products_select_all
on public.products
for select
using (true);

create policy products_insert_admin
on public.products
for insert
with check ((auth.jwt() ->> 'role') = 'admin');

create policy products_update_admin
on public.products
for update
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

create policy products_delete_admin
on public.products
for delete
using ((auth.jwt() ->> 'role') = 'admin');

create policy cart_items_select_own
on public.cart_items
for select
using (user_id = auth.uid());

create policy cart_items_insert_own
on public.cart_items
for insert
with check (user_id = auth.uid());

create policy cart_items_update_own
on public.cart_items
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy cart_items_delete_own
on public.cart_items
for delete
using (user_id = auth.uid());

create policy orders_select_own
on public.orders
for select
using (user_id = auth.uid());

create policy orders_insert_own
on public.orders
for insert
with check (user_id = auth.uid());

create policy order_items_select_own
on public.order_items
for select
using (
  exists (
    select 1 from public.orders
    where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);
