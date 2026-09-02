// 차수별 교육 일정/장소/신청인원 현황 + 신청하기 버튼 연결
import { getRounds, getRoundCount } from "./utils.js";

// applyUrl: 신청하기 버튼을 눌렀을 때 이동할 페이지 (예: "apply-dept.html")
export async function renderRoundStatus(targetId, configCol = "rounds", appCol = "deptApplications", applyUrl = null) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = '<p class="small">회차 정보를 불러오는 중...</p>';
  try {
    const rounds = await getRounds(configCol);
    if (!rounds || rounds.length === 0) {
      el.innerHTML = '<p class="small">아직 관리자가 등록한 교육 회차가 없습니다.</p>';
      return;
    }
    let html = '<table><thead><tr><th>차수</th><th>교육일정</th><th>교육장소</th><th>신청인원 / 총원</th>' + (applyUrl ? '<th>신청</th>' : '') + '</tr></thead><tbody>';
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
        ${applyUrl ? `<td>${isFull ? '' : `<a class="btn" style="padding:6px 12px;font-size:12px;display:inline-block;" href="${applyUrl}?round=${r.id}">신청하기</a>`}</td>` : ''}
      </tr>`;
    }
    html += '</tbody></table>';
    el.innerHTML = html;
  } catch (err) {
    console.error(err);
    el.innerHTML = '<p class="small" style="color:#c0392b;">회차 정보를 불러오지 못했습니다. (Firebase 연결을 확인해 주세요)</p>';
  }
}
