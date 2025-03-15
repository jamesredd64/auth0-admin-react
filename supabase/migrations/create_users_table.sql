create table public.users (
  id uuid default uuid_generate_v4() primary key,
  auth0_id text unique not null,
  first_name text,
  last_name text,
  email text unique not null,
  phone_number text,
  profile jsonb not null default '{}'::jsonb,
  address jsonb not null default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to read/write only their own data
create policy "Users can manage their own data"
  on public.users
  for all
  using (auth0_id = current_user)
  with check (auth0_id = current_user);