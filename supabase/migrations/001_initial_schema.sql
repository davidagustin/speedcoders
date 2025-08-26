-- Create notes table (as specified in requirements)
create table if not exists notes (
  id bigint primary key generated always as identity,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample notes
insert into notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!')
on conflict do nothing;

-- Enable RLS for notes
alter table notes enable row level security;

-- Create policy for public read access to notes
create policy "public can read notes"
on public.notes
for select to anon
using (true);

-- Create users table for authentication
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create leetcode_problems table
create table if not exists leetcode_problems (
  id serial primary key,
  leetcode_id integer unique not null,
  title text not null,
  slug text unique not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  categories text[] not null default '{}',
  algorithms text[] not null default '{}',
  data_structures text[] not null default '{}',
  techniques text[] not null default '{}',
  time_complexity text,
  space_complexity text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz_sessions table
create table if not exists quiz_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  time_limit_seconds integer not null,
  score integer,
  total_questions integer not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard', 'Mixed'))
);

-- Create quiz_questions table
create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references quiz_sessions(id) on delete cascade,
  problem_id integer references leetcode_problems(id),
  question_type text not null check (question_type in ('algorithm', 'data_structure', 'technique', 'complexity')),
  correct_answers text[] not null,
  user_answers text[],
  is_correct boolean,
  answered_at timestamp with time zone,
  time_taken_seconds integer
);

-- Create user_progress table
create table if not exists user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  problem_id integer references leetcode_problems(id),
  times_seen integer default 0,
  times_correct integer default 0,
  last_seen timestamp with time zone,
  mastery_level integer default 0 check (mastery_level between 0 and 100),
  unique(user_id, problem_id)
);

-- Create leaderboard view
create or replace view leaderboard as
select 
  u.username,
  u.email,
  count(distinct qs.id) as total_quizzes,
  avg(qs.score) as average_score,
  sum(qs.score) as total_score,
  max(qs.score) as best_score,
  count(distinct case when qs.difficulty = 'Hard' then qs.id end) as hard_quizzes_completed
from users u
left join quiz_sessions qs on u.id = qs.user_id
where qs.completed_at is not null
group by u.id, u.username, u.email
order by average_score desc, total_quizzes desc;

-- Enable RLS for all tables
alter table users enable row level security;
alter table leetcode_problems enable row level security;
alter table quiz_sessions enable row level security;
alter table quiz_questions enable row level security;
alter table user_progress enable row level security;

-- Create policies for authenticated users
create policy "Users can read their own data"
on users for select
using (auth.uid() = id);

create policy "Public can read problems"
on leetcode_problems for select
using (true);

create policy "Users can read their own quiz sessions"
on quiz_sessions for select
using (auth.uid() = user_id);

create policy "Users can create their own quiz sessions"
on quiz_sessions for insert
with check (auth.uid() = user_id);

create policy "Users can update their own quiz sessions"
on quiz_sessions for update
using (auth.uid() = user_id);

create policy "Users can read their own quiz questions"
on quiz_questions for select
using (exists (
  select 1 from quiz_sessions 
  where quiz_sessions.id = quiz_questions.session_id 
  and quiz_sessions.user_id = auth.uid()
));

create policy "Users can manage their own progress"
on user_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Insert sample LeetCode problems
insert into leetcode_problems (leetcode_id, title, slug, difficulty, categories, algorithms, data_structures, techniques, time_complexity, space_complexity)
values
  (1, 'Two Sum', 'two-sum', 'Easy', ARRAY['Array', 'Hash Table'], ARRAY['Brute Force', 'Hash Map', 'Two Pointers'], ARRAY['Array', 'Hash Table'], ARRAY['Complement Search', 'Index Tracking'], 'O(n)', 'O(n)'),
  (2, 'Add Two Numbers', 'add-two-numbers', 'Medium', ARRAY['Linked List', 'Math'], ARRAY['Elementary Math', 'Linked List Traversal'], ARRAY['Linked List'], ARRAY['Carry Propagation', 'Dummy Node'], 'O(max(m,n))', 'O(max(m,n))'),
  (3, 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', ARRAY['String', 'Sliding Window'], ARRAY['Sliding Window', 'Two Pointers'], ARRAY['Hash Set', 'Hash Map'], ARRAY['Window Expansion', 'Window Contraction'], 'O(n)', 'O(min(m,n))'),
  (20, 'Valid Parentheses', 'valid-parentheses', 'Easy', ARRAY['String', 'Stack'], ARRAY['Stack'], ARRAY['Stack', 'Hash Map'], ARRAY['Matching Pairs', 'LIFO'], 'O(n)', 'O(n)'),
  (121, 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', ARRAY['Array', 'Dynamic Programming'], ARRAY['One Pass', 'Dynamic Programming'], ARRAY['Array'], ARRAY['Min Tracking', 'Profit Calculation'], 'O(n)', 'O(1)')
on conflict (leetcode_id) do nothing;