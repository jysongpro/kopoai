// 차수별 연수 일정/장소/신청인원 현황을 항상 표시하는 공통 컴포넌트
import { getRounds, getRoundCount } from "./utils.js";

// configCol: "rounds"(학과장 연수) | "staffRounds"(학사담당 연수)
// appCol: "deptApplications" | "staffApplications"
export async function renderRoundStatus(targetId, configCol = "rounds", appCol = "deptApplications") {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = '<p class="small">회차 정보를 불러오는 중...</p>';
  try {
    const rounds = await getRounds(configCol);
    if (!rounds || rounds.length === 0) {
      el.innerHTML = '<p class="small">아직 관리자가 등록한 연수 회차가 없습니다.</p>';
      return;
    }
    let html = '<table><thead><tr><th>차수</th><th>연수일정</th><th>연수장소</th><th>신청가능인원 / 총원</th></tr></thead><tbody>';
    for (const r of rounds) {
      const count = await getRoundCount(appCol, r.id);
      const max = r.maxCount || 0;
      const isFull = max && count >= max;
      const remainText = max ? `${count} / ${max}` : `${count} / 제한없음`;
      html += `<tr>
        <td><b>${r.id}차</b></td>
        <td>${r.period || "-"}</td>
        <td>${r.location || "-"}</td>
        <td>${remainText} ${isFull ? '<span class="badge" style="background:#fdeceb;color:#c0392b;">마감</span>' : '<span class="badge">신청가능</span>'}</td>
      </tr>`;
    }
    html += '</tbody></table>';
    el.innerHTML = html;
  } catch (err) {
    console.error(err);
    el.innerHTML = '<p class="small" style="color:#c0392b;">회차 정보를 불러오지 못했습니다. (Firebase 연결을 확인해 주세요)</p>';
  }
}
