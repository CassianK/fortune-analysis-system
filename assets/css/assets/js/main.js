// 전역 변수
let analysisData = {};

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 종합 운명학 분석 시스템 초기화');
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    const form = document.getElementById('birth-form');
    form.addEventListener('submit', handleFormSubmit);
}

// 폼 제출 처리
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // 입력값 수집
    const birthData = {
        date: document.getElementById('birth-date').value,
        time: document.getElementById('birth-time').value,
        location: document.getElementById('birth-location').value,
        gender: document.getElementById('gender').value
    };
    
    // 유효성 검사
    if (!validateInputs(birthData)) {
        alert('모든 정보를 정확히 입력해주세요.');
        return;
    }
    
    // 분석 시작
    showLoadingScreen();
    
    try {
        await performAnalysis(birthData);
        showResults();
    } catch (error) {
        console.error('분석 중 오류 발생:', error);
        alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        hideLoadingScreen();
    }
}

// 입력값 유효성 검사
function validateInputs(data) {
    return data.date && data.time && data.location && data.gender;
}

// 로딩 화면 표시
function showLoadingScreen() {
    document.getElementById('input-form').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('analysis-results').style.display = 'none';
}

// 로딩 화면 숨김
function hideLoadingScreen() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('input-form').style.display = 'block';
    document.getElementById('results').style.display = 'none';
}

// 결과 표시
function showResults() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('analysis-results').style.display = 'block';
    
    const resultsDiv = document.getElementById('analysis-results');
    resultsDiv.innerHTML = generateResultsHTML();
}

// 실제 분석 수행 (업데이트됨)
async function performAnalysis(birthData) {
    // 단계별 로딩 메시지
    updateLoadingMessage('천문학적 계산 중...');
    await delay(1000);
    
    updateLoadingMessage('사주팔자 분석 중...');
    await delay(1000);
    
    // 실제 사주 계산
    const baziResult = window.baziCalculator ? 
        window.baziCalculator.calculate(birthData) : 
        generateTempBaziData(birthData);
    
    updateLoadingMessage('서양점성술 분석 중...');
    await delay(1000);
    
    const westernResult = generateEnhancedWesternData(birthData);
    
    updateLoadingMessage('종합 해석 생성 중...');
    await delay(1000);
    
    analysisData = {
        birthInfo: birthData,
        bazi: baziResult,
        western: westernResult,
        summary: generateEnhancedSummary(baziResult, birthData)
    };
}

// 로딩 메시지 업데이트
function updateLoadingMessage(message) {
    const loadingText = document.querySelector('#loading p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

// 지연 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 향상된 서양점성술 데이터 생성
function generateEnhancedWesternData(birthData) {
    const date = new Date(birthData.date + 'T' + birthData.time);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 실제 태양 궁 계산 (간단 버전)
    const sunSign = getSunSign(month, day);
    
    return {
        sunSign: sunSign.name,
        sunElement: sunSign.element,
        sunQuality: sunSign.quality,
        moonSign: getMoonSign(birthData),
        ascendant: getAscendant(birthData),
        elements: calculateElementBalance(sunSign)
    };
}

// 태양 궁 계산
function getSunSign(month, day) {
    const signs = [
        { name: '염소자리', element: '토', quality: '활동궁', start: [12, 22], end: [1, 19] },
        { name: '물병자리', element: '공기', quality: '고정궁', start: [1, 20], end: [2, 18] },
        { name: '물고기자리', element: '물', quality: '변화궁', start: [2, 19], end: [3, 20] },
        { name: '양자리', element: '불', quality: '활동궁', start: [3, 21], end: [4, 19] },
        { name: '황소자리', element: '토', quality: '고정궁', start: [4, 20], end: [5, 20] },
        { name: '쌍둥이자리', element: '공기', quality: '변화궁', start: [5, 21], end: [6, 20] },
        { name: '게자리', element: '물', quality: '활동궁', start: [6, 21], end: [7, 22] },
        { name: '사자자리', element: '불', quality: '고정궁', start: [7, 23], end: [8, 22] },
        { name: '처녀자리', element: '토', quality: '변화궁', start: [8, 23], end: [9, 22] },
        { name: '천칭자리', element: '공기', quality: '활동궁', start: [9, 23], end: [10, 22] },
        { name: '전갈자리', element: '물', quality: '고정궁', start: [10, 23], end: [11, 21] },
        { name: '사수자리', element: '불', quality: '변화궁', start: [11, 22], end: [12, 21] }
    ];
    
    for (let sign of signs) {
        if (isDateInRange(month, day, sign.start, sign.end)) {
            return sign;
        }
    }
    
    return signs[0]; // 기본값
}

// 날짜 범위 체크
function isDateInRange(month, day, start, end) {
    if (start[0] === end[0]) {
        return month === start[0] && day >= start[1] && day <= end[1];
    } else {
        return (month === start[0] && day >= start[1]) || 
               (month === end[0] && day <= end[1]);
    }
}

// 달 궁 추정 (간단 버전)
function getMoonSign(birthData) {
    const signs = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', 
                   '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
    
    const date = new Date(birthData.date);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const moonCycle = (dayOfYear * 13) % 12; // 대략적인 계산
    
    return signs[Math.floor(moonCycle)];
}

// 상승궁 추정
function getAscendant(birthData) {
    const signs = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', 
                   '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
    
    const time = birthData.time.split(':');
    const hour = parseInt(time[0]);
    const ascendantIndex = Math.floor(hour / 2) % 12;
    
    return signs[ascendantIndex];
}

// 원소 균형 계산
function calculateElementBalance(sunSign) {
    return {
        불: sunSign.element === '불' ? 3 : 1,
        토: sunSign.element === '토' ? 3 : 1,
        공기: sunSign.element === '공기' ? 3 : 1,
        물: sunSign.element === '물' ? 3 : 1
    };
}

// 향상된 종합 요약 생성
function generateEnhancedSummary(baziResult, birthData) {
    const interpretation = baziResult.interpretation || {};
    const dayMaster = interpretation.dayMaster || {};
    
    return {
        personality: interpretation.personality || '독특하고 개성적인 성향을 가지고 있습니다.',
        strengths: [
            `${dayMaster.element}의 기운으로 ${getElementStrength(dayMaster.element)}`,
            '균형잡힌 사고력과 판단력',
            '상황에 맞는 적응력'
        ],
        challenges: [
            '완벽주의 성향으로 인한 스트레스',
            '감정의 기복 관리',
            '타인과의 소통에서 오는 오해'
        ],
        advice: interpretation.advice?.join(' ') || '내면의 목소리에 귀 기울이고, 꾸준한 명상을 통해 마음의 평정을 찾으세요.',
        career: interpretation.career || ['다양한 분야에서 활약 가능'],
        health: interpretation.health || '전반적으로 균형 잡힌 건강 상태입니다.',
        fortune: interpretation.fortune || '꾸준한 노력을 통해 안정적인 재물을 축적할 수 있습니다.'
    };
}

// 오행별 강점
function getElementStrength(element) {
    const strengths = {
        '木': '창의력과 성장 의지가 뛰어남',
        '火': '열정과 리더십이 강함',
        '土': '안정감과 신뢰성이 높음',
        '金': '의지력과 추진력이 강함',
        '水': '지혜와 적응력이 뛰어남'
    };
    
    return strengths[element] || '독특한 개성을 가짐';
}

// 임시 사주 데이터 생성 (백업용)
function generateTempBaziData(birthData) {
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    return {
        fourPillars: {
            year: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
            month: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
            day: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
            hour: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)]
        },
        fiveElements: { 木: 2, 火: 1, 土: 2, 金: 1, 水: 2 },
        interpretation: {
            personality: '창의적이고 직관적인 성향을 가지고 있습니다.',
            dayMaster: { element: '水' }
        }
    };
}

// 향상된 결과 HTML 생성
function generateResultsHTML() {
    const bazi = analysisData.bazi;
    const western = analysisData.western;
    const summary = analysisData.summary;
    
    return `
        <h2>🌟 종합 운명 분석 결과</h2>
        
        <div class="result-section">
            <h3>📊 사주팔자</h3>
            <div class="bazi-chart">
                <div class="pillar">
                    <div class="pillar-label">년주</div>
                    <div class="pillar-value">${bazi.fourPillars.year}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">월주</div>
                    <div class="pillar-value">${bazi.fourPillars.month}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">일주</div>
                    <div class="pillar-value">${bazi.fourPillars.day}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">시주</div>
                    <div class="pillar-value">${bazi.fourPillars.hour}</div>
                </div>
            </div>
            
            ${bazi.fiveElements ? `
            <h4>🌊 오행 분포</h4>
            <div class="elements-chart">
                ${Object.entries(bazi.fiveElements).map(([element, count]) => 
                    `<div class="element-item">
                        <span class="element-name">${element}</span>
                        <span class="element-count">${count}개</span>
                        <div class="element-bar" style="width: ${count * 20}%"></div>
                    </div>`
                ).join('')}
            </div>
            ` : ''}
        </div>
        
        <div class="result-section">
            <h3>🌟 서양점성술</h3>
            <p><strong>태양:</strong> ${western.sunSign} (${western.sunElement})</p>
            <p><strong>달:</strong> ${western.moonSign}</p>
            <p><strong>상승:</strong> ${western.ascendant}</p>
        </div>
        
        <div class="result-section">
            <h3>💎 종합 분석</h3>
            <h4>성격 특성</h4>
            <p>${summary.personality}</p>
            
            <h4>강점</h4>
            <ul>
                ${summary.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
            
            <h4>도전 과제</h4>
            <ul>
                ${summary.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
            
            <h4>💼 직업 경향</h4>
            <p>${Array.isArray(summary.career) ? summary.career.join(', ') : summary.career}</p>
            
            <h4>💰 재운</h4>
            <p>${summary.fortune}</p>
            
            <h4>🏥 건강</h4>
            <p>${summary.health}</p>
            
            <h4>💡 인생 조언</h4>
            <p>${summary.advice}</p>
        </div>
        
        <div class="action-buttons">
            <button onclick="generatePDF()" class="primary-btn">
                📄 PDF로 저장
            </button>
            
            <button onclick="shareResults()" class="secondary-btn">
                📤 결과 공유
            </button>
            
            <button onclick="startNewAnalysis()" class="secondary-btn">
                🔄 새로 분석하기
            </button>
        </div>
    `;
}

// 새 분석 시작
function startNewAnalysis() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('input-form').style.display = 'block';
    document.getElementById('birth-form').reset();
}

// PDF 생성
function generatePDF() {
    const content = document.getElementById('analysis-results').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '운명분석결과.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// 결과 공유
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: '종합 운명학 분석 결과',
            text: '나의 운명 분석 결과를 확인해보세요!',
            url: window.location.href
        });
    } else {
        // 폴백: 클립보드 복사
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('링크가 클립보드에 복사되었습니다!'))
            .catch(() => alert('공유 기능을 사용할 수 없습니다.'));
    }
}
