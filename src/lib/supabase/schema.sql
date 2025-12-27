-- Cassie Platform Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector"; -- For RAG embeddings

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan_type text check (plan_type in ('quick_start', 'spark', 'journey', 'transform')),
  plan_purchased_at timestamp with time zone,
  stripe_customer_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Sites table (the generated sites for recipients)
create table public.sites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  recipient_name text not null,
  sender_name text not null,
  password_hash text not null,
  is_published boolean default false,

  -- Theme settings
  theme_preset text default 'original',
  color_primary text default '#f97316', -- orange
  color_secondary text default '#ef4444', -- red
  color_accent text default '#a855f7', -- purple

  -- Site content
  hero_video_url text,
  letter_content text,

  -- Analytics
  first_opened_at timestamp with time zone,
  last_opened_at timestamp with time zone,
  total_views integer default 0,

  -- Custom domain (for Transform plan)
  custom_domain text,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Journal entries table
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  site_id uuid references public.sites(id) on delete cascade not null,

  day_number integer not null check (day_number >= 1 and day_number <= 90),
  week_number integer not null check (week_number >= 1 and week_number <= 13),

  -- Entry categorization
  prompt_category text check (prompt_category in ('wake_up', 'understanding', 'appreciation', 'commitment', 'general')),
  prompt_text text,

  -- Content
  content text not null,
  word_count integer default 0,

  -- Voice-to-text tracking
  was_voice_recorded boolean default false,

  -- RAG embedding for searchable context
  embedding vector(1536),

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Site sections (structured content for each page)
create table public.site_sections (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,

  -- Section type
  section_type text not null check (section_type in (
    'my_side_card', 'their_side_card', 'future_vision',
    'what_went_wrong', 'what_i_understand', 'structural_change',
    'promise', 'the_ask'
  )),

  -- Content
  title text,
  content text not null,
  before_text text, -- For structural_change type
  after_text text,  -- For structural_change type

  -- Media
  image_url text,
  video_url text,
  song_url text,
  song_lyrics text,

  -- Ordering
  display_order integer default 0,

  created_at timestamp with time zone default now()
);

-- Generated AI context (compiled from journal entries)
create table public.generated_contexts (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,

  -- Compiled sections
  full_context text not null,
  identity_section text,
  journey_section text,
  understanding_section text,
  appreciation_section text,
  commitment_section text,
  response_guidelines text,

  -- Custom context (if user wants to override)
  custom_context text,
  use_custom boolean default false,

  -- Fallback responses
  fallback_responses jsonb,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Uploaded evidence (screenshots, documents, etc.)
create table public.evidence_uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  site_id uuid references public.sites(id) on delete cascade,

  file_url text not null,
  file_type text not null, -- image, document, text
  file_name text,
  description text,

  -- For AI to analyze
  extracted_text text,

  created_at timestamp with time zone default now()
);

-- Recipient engagement tracking
create table public.recipient_engagement (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,

  -- Page views
  page_path text not null,
  time_spent_seconds integer default 0,

  -- Session tracking
  session_id text,

  created_at timestamp with time zone default now()
);

-- Recipient reactions
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,
  section_id uuid references public.site_sections(id) on delete cascade,

  reaction_type text not null check (reaction_type in ('heart', 'bookmark', 'comment')),
  comment_text text,

  -- Privacy: does sender see this?
  visible_to_sender boolean default true,

  created_at timestamp with time zone default now()
);

-- Chat messages (AI chatbot conversations)
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,

  role text not null check (role in ('user', 'assistant')),
  content text not null,

  -- For RAG: which journal entries were referenced
  referenced_entries uuid[],

  -- Privacy
  visible_to_sender boolean default true,

  created_at timestamp with time zone default now()
);

-- Recipient journeys (two-way journaling)
create table public.recipient_journeys (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,

  -- Recipient opted in
  started_at timestamp with time zone default now(),
  plan_type text check (plan_type in ('spark', 'journey', 'transform')),

  -- Progress
  current_day integer default 1,
  streak_count integer default 0,

  -- Privacy settings
  share_with_sender boolean default false
);

-- Recipient journal entries
create table public.recipient_entries (
  id uuid default uuid_generate_v4() primary key,
  recipient_journey_id uuid references public.recipient_journeys(id) on delete cascade not null,

  day_number integer not null,
  content text not null,
  word_count integer default 0,

  -- RAG embedding
  embedding vector(1536),

  -- Privacy
  visible_to_sender boolean default false,

  created_at timestamp with time zone default now()
);

-- User benchmarks and goals
create table public.benchmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  site_id uuid references public.sites(id) on delete cascade,

  benchmark_type text check (benchmark_type in ('behavior_stop', 'behavior_start', 'relationship_goal', 'custom')),
  description text not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,

  created_at timestamp with time zone default now()
);

-- Daily quotes (shown during journaling)
create table public.daily_quotes (
  id uuid default uuid_generate_v4() primary key,
  quote_text text not null,
  author text,
  category text, -- healing, growth, love, accountability
  source text
);

-- Book recommendations
create table public.book_recommendations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  author text not null,
  description text,
  cover_url text,
  amazon_url text,
  category text, -- healing, communication, relationships, growth
  situation_tags text[] -- breakup, rebuilding, trust, etc.
);

-- Row Level Security Policies

-- Profiles: users can only see their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Sites: users can only manage their own sites
alter table public.sites enable row level security;
create policy "Users can view own sites" on public.sites
  for select using (auth.uid() = user_id);
create policy "Users can insert own sites" on public.sites
  for insert with check (auth.uid() = user_id);
create policy "Users can update own sites" on public.sites
  for update using (auth.uid() = user_id);
create policy "Users can delete own sites" on public.sites
  for delete using (auth.uid() = user_id);

-- Journal entries: users can only manage their own entries
alter table public.journal_entries enable row level security;
create policy "Users can view own entries" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "Users can insert own entries" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "Users can update own entries" on public.journal_entries
  for update using (auth.uid() = user_id);

-- Similar policies for other tables...

-- Functions

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update word count on entry insert/update
create or replace function public.update_word_count()
returns trigger as $$
begin
  new.word_count := array_length(regexp_split_to_array(trim(new.content), '\s+'), 1);
  return new;
end;
$$ language plpgsql;

create trigger update_journal_word_count
  before insert or update on public.journal_entries
  for each row execute procedure public.update_word_count();

-- Function to increment site views
create or replace function public.increment_site_views(site_slug text)
returns void as $$
begin
  update public.sites
  set
    total_views = total_views + 1,
    last_opened_at = now(),
    first_opened_at = coalesce(first_opened_at, now())
  where slug = site_slug;
end;
$$ language plpgsql security definer;

-- Create indexes for performance
create index idx_journal_entries_user_id on public.journal_entries(user_id);
create index idx_journal_entries_site_id on public.journal_entries(site_id);
create index idx_sites_slug on public.sites(slug);
create index idx_sites_user_id on public.sites(user_id);
create index idx_chat_messages_site_id on public.chat_messages(site_id);
