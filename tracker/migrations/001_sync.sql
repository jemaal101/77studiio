-- Applied to the kitted-lab Supabase project (ap-southeast-2).
-- Kept here so the schema is reviewable in the repo alongside the client.
create table public.sync (
  id          text primary key,
  blob        text   not null,
  updated     bigint not null,
  created_at  timestamptz not null default now(),
  touched_at  timestamptz not null default now()
);

alter table public.sync enable row level security;
revoke all on table public.sync from anon, authenticated;

create function public.sync_pull(p_id text)
returns table (blob text, updated bigint)
language sql security definer set search_path = public as $$
  select s.blob, s.updated from public.sync s where s.id = p_id;
$$;

create function public.sync_push(p_id text, p_blob text, p_updated bigint, p_base bigint)
returns table (ok boolean, updated bigint, blob text)
language plpgsql security definer set search_path = public as $$
declare cur_updated bigint; cur_blob text;
begin
  if p_id is null or length(p_id) <> 64 then raise exception 'bad sync id'; end if;
  if p_blob is null or length(p_blob) > 4000000 then raise exception 'payload out of range'; end if;
  select s.updated, s.blob into cur_updated, cur_blob from public.sync s where s.id = p_id;
  if cur_updated is null then
    insert into public.sync (id, blob, updated) values (p_id, p_blob, p_updated);
    return query select true, p_updated, null::text; return;
  end if;
  if cur_updated = p_base then
    update public.sync set blob = p_blob, updated = p_updated, touched_at = now() where id = p_id;
    return query select true, p_updated, null::text; return;
  end if;
  return query select false, cur_updated, cur_blob;
end;
$$;

revoke all on function public.sync_pull(text) from public;
revoke all on function public.sync_push(text, text, bigint, bigint) from public;
grant execute on function public.sync_pull(text) to anon;
grant execute on function public.sync_push(text, text, bigint, bigint) to anon;
