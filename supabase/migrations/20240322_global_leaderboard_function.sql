create or replace function global_leaderboard()
returns table(
  nickname text,
  user_id uuid,
  total_score int,
  quizzes_played int
) as $$
  select
    coalesce(user_id::text, nickname) as nickname,
    user_id,
    sum(score) as total_score,
    count(*) as quizzes_played
  from quiz_results
  group by coalesce(user_id::text, nickname), user_id
  order by sum(score) desc, count(*) desc
  limit 20;
$$ language sql stable; 