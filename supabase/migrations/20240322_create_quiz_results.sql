create table if not exists quiz_results (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references quizzes(id) on delete cascade,
  user_id uuid references user_profiles(id) on delete set null,
  nickname text,
  score int,
  time_seconds int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
create index if not exists quiz_results_quiz_id_idx on quiz_results(quiz_id); 