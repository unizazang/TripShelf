insert into trips
  (id, title, destination, start_date, end_date, description, cover_image_url)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '도쿄 3박 4일 여행',
    '도쿄',
    '2026-04-01',
    '2026-04-04',
    '벚꽃 시즌에 다녀온 도쿄 여행 기록',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '부산 주말 여행',
    '부산',
    '2026-03-15',
    '2026-03-16',
    '바다와 음식 위주로 다녀온 짧은 여행',
    'https://images.unsplash.com/photo-1554787614-8d7b4b70d7ff?q=80&w=1200&auto=format&fit=crop'
  );

insert into trip_entries
  (trip_id, entry_date, title, content, image_url, mood_tag)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '2026-04-01',
    '첫날 도착',
    '나리타 공항에 도착해서 숙소에 짐을 풀고 근처 골목을 걸었다.',
    'https://images.unsplash.com/photo-1526481280695-3c4691f9f66f?q=80&w=1200&auto=format&fit=crop',
    '설렘'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    '2026-04-02',
    '우에노 공원 벚꽃',
    '벚꽃이 정말 많았고 사람들이 많았지만 분위기가 좋았다.',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    '행복'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '2026-03-15',
    '광안리 산책',
    '저녁에 광안리 해변을 걸으면서 야경을 봤다.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    '평온'
  );

insert into print_orders
  (trip_id, book_title, subtitle, theme, include_scope, status)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '도쿄 여행 기록집',
    '2026년 봄 벚꽃 여행',
    'photo',
    'all',
    'pending'
  );