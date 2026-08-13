작업 체크리스트

1. ( o ) 프로젝트 기본 세팅
2. ( o ) 디자인 시스템 만들기
3. ( ) Supabase 프로젝트 생성
4. ( ) 회원 인증 먼저 완성
5. ( ) DB 테이블 설계
6. ( ) 마이페이지의 사용자 정보
7. ( ) 여행 생성 기능
8. ( ) HOME
9. ( ) 여행 상세 공통 레이아웃
10. ( ) Google Places / Maps 연결
11. ( ) 여행 준비 탭
12. ( ) 일정 탭
13. ( ) 하단 지도
14. ( ) 지출
15. ( ) 마이페이지 여행 목록 완성
16. ( ) 마지막 통합 작업
17. ( ) 배포

디자인 시스템

    ## color

    Primary 500 #3478F6
    Primary 600 #2468E5
    Primary 100 #EAF2FF
    Black #191919
    Gray 700 #555555
    Gray 500 #888888
    Gray 300 #D9D9D9
    Gray 100 #F5F5F5

    ## typography

    H1 28px Bold 700 36px -2%
    H2 24px Bold 700 32px -2%
    H3 20px SemiBold 600 28px -2%
    Title 18px SemiBold 600 26px -1%
    Body 1 16px Regular 400 24px -1%
    Body 2 14px Regular 400 20px -1%
    Caption 12px Regular 400 18px 0%
    Button 16px SemiBold 600 24px 0%

    ## Button

    # Primary Button

    Width: 350px
    Height: 52px
    Radius: 12px
    Background: Primary 500 (#3478F6)
    Font Color: #FFFFFF

    Typography:
    16px / SemiBold 600
    Line-height: 24px
    Letter-spacing: 0%

    # Small Button

    Padding: 6px 10px
    Radius: Full (Pill)
    Background: Primary 500 (#3478F6)
    Font Color: #FFFFFF

    # Place Add Button

    Width: 100%
    Height: 38px
    Radius: 12px

    Padding X: 10px
    Icon ↔ Text Gap: 10px

    Border: none
    Background: Gray 100 (#F5F5F5)
    Font Color: Gray 500 (#888888)

    ## Input

    # Primary Input

    Width: 350px (실제 구현 w-full)
    Height: 52px
    Radius: 12px

    Padding X: 10px
    Icon ↔ Placeholder: 10px

    Background: Gray 100 (#F5F5F5)

    Default Border: none
    Focus Border: Gray 500 (#888888)

    Placeholder: Gray 500 (#888888)

    # In Card Memo Input

    Width: 100%
    Height: 38px
    Radius: 12px

    Padding X: 10px

    Background: Gray 100 (#F5F5F5)

    Default Border: none
    Focus Border: Gray 500 (#888888)

    Placeholder: Gray 500 (#888888)

    ## Card

    # Card Type 1

    Width: 100%
    Height: 120px
    Padding: 0

    Border: 1px / Gray 300 (#D9D9D9)
    Radius: 12px

    Image
    - Width: 100px
    - Height: 120px
    - Radius: 6px

    Image ↔ 여행 정보 Gap: 20px

    # Contents Card

    Width: 100%
    Height: auto

    Padding: 10px

    Border: 1px / Gray 300 (#D9D9D9)
    Radius: 12px

    ## BottomNav
    - Width: 100%
    - Padding: 10px 30px
    - Radius: 20px
    - Background: Gray 100
    - Border: none
    - Shadow + Glass Effect

    Bottom 위치:
    20px + 기기 Safe Area

    기본:
    Icon / Text → Gray 500

    선택:
    Icon / Text → Primary 500

    ## Bottom Sheet
    - Width: 100%
    - Height: 70%
    - Background: #FFFFFF
    - Radius: 상단 좌/우 12px
    - 하단 Radius: 0

    Overlay
    - 나머지 상단 30%
    - Background: #000000 / 40%
