# 2027학년도 교과과정개편 연수 신청 시스템

학교법인 한국폴리텍대학 AI혁신부 배포용 웹앱입니다. GitHub Pages(정적 호스팅) + Firebase Firestore(데이터 저장)로 동작합니다.

## 1. Firebase 프로젝트 준비 (필수, 5분 소요)

1. https://console.firebase.google.com 접속 → "프로젝트 추가"로 새 프로젝트 생성 (예: `2027-curriculum-training`)
2. 왼쪽 메뉴 **Firestore Database** → "데이터베이스 만들기" → **테스트 모드**로 시작 (또는 아래 보안 규칙 참고)
3. 왼쪽 메뉴 **프로젝트 설정(톱니바퀴)** → 하단 "내 앱" → `</>` 웹 아이콘 클릭 → 앱 등록(닉네임 아무거나)
4. 화면에 표시되는 `firebaseConfig` 객체 값을 복사
5. 이 프로젝트의 `js/firebase-config.js` 파일을 열어 복사한 값으로 교체 후 저장

```js
export const firebaseConfig = {
  apiKey: "실제값",
  authDomain: "실제값",
  projectId: "실제값",
  storageBucket: "실제값",
  messagingSenderId: "실제값",
  appId: "실제값"
};
```

## 2. Firestore 보안 규칙 (권장)

Firestore Database → 규칙 탭에서 아래로 교체 (테스트 모드 만료 방지 + 최소한의 보호):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /staffApplications/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /deptApplications/{doc} {
      allow create: if true;
      allow read: if true;
      allow update: if true;
      allow delete: if false;
    }
    match /rounds/{doc} {
      allow read: if true;
      allow write: if true; // 필요시 관리자 인증 강화 권장
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if true; // 필요시 관리자 인증 강화 권장
    }
  }
}
```

> 참고: 본 시스템의 "관리자 인증"은 Firestore에 저장된 비밀번호를 확인하는 **간단한 클라이언트 측 인증**입니다.
> 보안을 강화하려면 Firebase Authentication(이메일/비밀번호) 도입을 권장합니다.

## 3. 회차 및 신청기간 설정

1. `admin.html` 접속 → 초기 비밀번호 `000000` 으로 로그인
2. "신청 기간 설정"에서 신청 가능 시작/종료일 입력 후 저장
3. "회차별 설정"에서 1~10차 중 실제 운영할 차수만 체크 → 연수장소/기간/최대인원 입력 후 저장
4. 필요시 "비밀번호 변경"에서 관리자 비밀번호 변경

## 4. 메뉴별 기능 요약

| 메뉴 | 파일 | 설명 |
|---|---|---|
| 신규신청(학사담당) | apply-staff.html | 인원제한 없음, 대학/캠퍼스/담당과정(복수)/직급/이름 |
| 신규신청(학과장) | apply-dept.html | 전화번호 기본키, 중복신청 불가, 세부 교과편성과정(복수), 참석차수, 숙박여부 |
| 변경하기(학과장) | edit-dept.html | 전화번호로 조회 후 정보 수정, 정원 초과 회차로는 변경 불가 |
| 관리자 | admin.html | 로그인, 신청기간/회차(장소·기간·정원) 설정, 비밀번호 변경, 명단 엑셀 다운로드 |

## 5. GitHub Pages 배포 방법

1. 이 프로젝트 폴더 전체를 GitHub 저장소에 push
2. 저장소 **Settings → Pages** → Source를 `main` 브랜치 `/ (root)`로 설정
3. 몇 분 후 `https://[아이디].github.io/[저장소명]/` 로 접속 가능

## 6. 데이터 구조 (Firestore)

- `staffApplications/{autoId}`: university, campus, courses[], position, name, createdAt
- `deptApplications/{phone}`: phone, university, campus, courses[], position, name, isHead(Y/N), stay(Y/N), round(1~10), createdAt, updatedAt
- `settings/main`: adminPassword, applyStart, applyEnd
- `rounds/{1~10}`: enabled(bool), location, period, maxCount

## 7. 대학-캠퍼스 데이터

`js/campus-data.js`에 첨부해주신 `1.xlsx` 기준으로 대학별 캠퍼스 목록이 자동 생성되어 있습니다. 캠퍼스 구성이 바뀌면 이 파일의 `CAMPUS_DATA` 객체를 직접 수정하면 됩니다.
