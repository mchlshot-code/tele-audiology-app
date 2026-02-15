drop policy if exists products_insert_admin on public.products;
drop policy if exists products_update_admin on public.products;
drop policy if exists products_delete_admin on public.products;

create policy products_insert_admin
on public.products
for insert
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy products_update_admin
on public.products
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy products_delete_admin
on public.products
for delete
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
