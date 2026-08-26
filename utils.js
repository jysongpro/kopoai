// 공통 유틸 함수
import { db, doc, getDoc, collection, getDocs, query, where } from "./firebase-init.js";

// 관리자 설정(settings/main) 문서 가져오기
export async function getSettings() {
  const snap = await getDoc(doc(db, "settings", "main"));
  if (snap.exists()) return snap.data();
  return {
    adminPassword: "000000",
    applyStart: "",
    applyEnd: ""
  };
}

// 신청가능기간 여부 확인
export function isApplyPeriodOpen(settings) {
  if (!settings.applyStart || !settings.applyEnd) return true; // 미설정시 항상 오픈
  const now = new Date();
  const start = new Date(settings.applyStart);
  const end = new Date(settings.applyEnd + "T23:59:59");
  return now >= start && now <= end;
}

// 회차 설정(rounds/1 ~ rounds/10) 전체 가져오기
export async function getRounds() {
  const rounds = [];
  for (let i = 1; i <= 10; i++) {
    const snap = await getDoc(doc(db, "rounds", String(i)));
    if (snap.exists()) {
      const d = snap.data();
      if (d.enabled) rounds.push({ id: i, ...d });
    }
  }
  return rounds;
}

// 특정 회차의 현재 신청 인원수 (deptApplications 컬렉션에서 round 필드 카운트)
export async function getRoundCount(roundId, excludePhone = null) {
  const q = query(collection(db, "deptApplications"), where("round", "==", roundId));
  const snap = await getDocs(q);
  let count = 0;
  snap.forEach(d => {
    if (!excludePhone || d.id !== excludePhone) count++;
  });
  return count;
}

export function formatPhone(v) {
  return v.replace(/[^0-9]/g, "");
}
