create policy orders_select_admin
on public.orders
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy orders_update_admin
on public.orders
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy orders_delete_admin
on public.orders
for delete
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy order_items_select_admin
on public.order_items
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
