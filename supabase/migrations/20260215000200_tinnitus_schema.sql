create table public.tinnitus_screenings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  duration text check (duration in ('persistent', 'recent_onset', 'transient', 'temporary', 'occasional', 'intermittent', 'constant')),
  bothersomeness_score integer check (bothersomeness_score between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tinnitus_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  screening_id uuid references public.tinnitus_screenings(id),
  ths_section_a_score integer,
  ths_section_b_score integer,
  ths_section_c_screening boolean,
  ths_section_d_score integer,
  tinnitus_impact text check (tinnitus_impact in ('none', 'mild', 'moderate', 'severe', 'catastrophic')),
  recommended_step text check (recommended_step in ('step_2', 'step_3', 'step_4', 'step_5', 'step_6')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tinnitus_treatments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  assessment_id uuid references public.tinnitus_assessments(id),
  treatment_type text check (treatment_type in ('education', 'counseling', 'sound_therapy', 'cbt', 'comprehensive')),
  status text check (status in ('scheduled', 'in_progress', 'completed')) default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sound_masking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  sound_type text check (sound_type in ('white_noise', 'pink_noise', 'brown_noise', 'nature_sounds', 'rain', 'ocean', 'forest', 'custom')),
  duration_minutes integer,
  volume_level integer check (volume_level between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.outcome_measures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  treatment_id uuid references public.tinnitus_treatments(id),
  measurement_type text check (measurement_type in ('tfi', 'thi', 'ths')),
  score integer,
  global_change text check (global_change in ('very_much_worse', 'much_worse', 'a_little_worse', 'no_change', 'a_little_better', 'much_better', 'very_much_better')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_tinnitus_screenings_updated_at
before update on public.tinnitus_screenings
for each row execute function public.set_updated_at();

create trigger set_tinnitus_assessments_updated_at
before update on public.tinnitus_assessments
for each row execute function public.set_updated_at();

create trigger set_tinnitus_treatments_updated_at
before update on public.tinnitus_treatments
for each row execute function public.set_updated_at();

create trigger set_sound_masking_sessions_updated_at
before update on public.sound_masking_sessions
for each row execute function public.set_updated_at();

create trigger set_outcome_measures_updated_at
before update on public.outcome_measures
for each row execute function public.set_updated_at();

alter table public.tinnitus_screenings enable row level security;
alter table public.tinnitus_assessments enable row level security;
alter table public.tinnitus_treatments enable row level security;
alter table public.sound_masking_sessions enable row level security;
alter table public.outcome_measures enable row level security;

create policy tinnitus_screenings_select_own
on public.tinnitus_screenings
for select
using (user_id = auth.uid());

create policy tinnitus_screenings_insert_own
on public.tinnitus_screenings
for insert
with check (user_id = auth.uid());

create policy tinnitus_screenings_update_own
on public.tinnitus_screenings
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy tinnitus_screenings_delete_own
on public.tinnitus_screenings
for delete
using (user_id = auth.uid());

create policy tinnitus_assessments_select_own
on public.tinnitus_assessments
for select
using (user_id = auth.uid());

create policy tinnitus_assessments_insert_own
on public.tinnitus_assessments
for insert
with check (user_id = auth.uid());

create policy tinnitus_assessments_update_own
on public.tinnitus_assessments
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy tinnitus_assessments_delete_own
on public.tinnitus_assessments
for delete
using (user_id = auth.uid());

create policy tinnitus_treatments_select_own
on public.tinnitus_treatments
for select
using (user_id = auth.uid());

create policy tinnitus_treatments_insert_own
on public.tinnitus_treatments
for insert
with check (user_id = auth.uid());

create policy tinnitus_treatments_update_own
on public.tinnitus_treatments
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy tinnitus_treatments_delete_own
on public.tinnitus_treatments
for delete
using (user_id = auth.uid());

create policy sound_masking_sessions_select_own
on public.sound_masking_sessions
for select
using (user_id = auth.uid());

create policy sound_masking_sessions_insert_own
on public.sound_masking_sessions
for insert
with check (user_id = auth.uid());

create policy sound_masking_sessions_update_own
on public.sound_masking_sessions
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy sound_masking_sessions_delete_own
on public.sound_masking_sessions
for delete
using (user_id = auth.uid());

create policy outcome_measures_select_own
on public.outcome_measures
for select
using (user_id = auth.uid());

create policy outcome_measures_insert_own
on public.outcome_measures
for insert
with check (user_id = auth.uid());

create policy outcome_measures_update_own
on public.outcome_measures
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy outcome_measures_delete_own
on public.outcome_measures
for delete
using (user_id = auth.uid());
