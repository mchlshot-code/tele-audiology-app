create policy hearing_assessments_select_admin
on public.hearing_assessments
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy consultations_select_admin
on public.consultations
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy consultations_update_admin
on public.consultations
for update
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy tinnitus_screenings_select_admin
on public.tinnitus_screenings
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy tinnitus_assessments_select_admin
on public.tinnitus_assessments
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy tinnitus_treatments_select_admin
on public.tinnitus_treatments
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy sound_masking_sessions_select_admin
on public.sound_masking_sessions
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy outcome_measures_select_admin
on public.outcome_measures
for select
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));
