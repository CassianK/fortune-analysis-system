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

// 분석 수행 (임시 구현)
async function performAnalysis(birthData) {
    // 임시 지연 (실제 계산 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    analysisData = {
        birthInfo: birthData,
        bazi: generateTempBaziData(birthData),
        western: generateTempWesternData(birthData),
        summary: generateTempSummary(birthData)
    };
}

// 임시 사주 데이터 생성
function generateTempBaziData(birthData) {
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    return {
        year: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
        month: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
        day: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)],
        hour: tianGan[Math.floor(Math.random() * 10)] + diZhi[Math.floor(Math.random() * 12)]
    };
}

// 임시 서양점성술 데이터 생성
function generateTempWesternData(birthData) {
    const signs = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', 
                   '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
    
    return {
        sunSign: signs[Math.floor(Math.random() * 12)],
        moonSign: signs[Math.floor(Math.random() * 12)],
        ascendant: signs[Math.floor(Math.random() * 12)]
    };
}

// 임시 종합 요약 생성
function generateTempSummary(birthData) {
    return {
        personality: '창의적이고 직관적인 성향을 가지고 있습니다.',
        strengths: ['뛰어난 감수성', '창의적 사고력', '강한 직관력'],
        challenges: ['완벽주의 성향', '감정 기복', '우유부단함'],
        advice: '내면의 목소리에 귀 기울이고, 꾸준한 명상을 통해 마음의 평정을 찾으세요.'
    };
}

// 결과 HTML 생성
function generateResultsHTML() {
    return `
        <h2>🌟 운명 분석 결과</h2>
        
        <div class="result-section">
            <h3>📊 사주팔자</h3>
            <div class="bazi-chart">
                <div class="pillar">
                    <div class="pillar-label">년주</div>
                    <div class="pillar-value">${analysisData.bazi.year}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">월주</div>
                    <div class="pillar-value">${analysisData.bazi.month}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">일주</div>
                    <div class="pillar-value">${analysisData.bazi.day}</div>
                </div>
                <div class="pillar">
                    <div class="pillar-label">시주</div>
                    <div class="pillar-value">${analysisData.bazi.hour}</div>
                </div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>🌟 서양점성술</h3>
            <p><strong>태양:</strong> ${analysisData.western.sunSign}</p>
            <p><strong>달:</strong> ${analysisData.western.moonSign}</p>
            <p><strong>상승:</strong> ${analysisData.western.ascendant}</p>
        </div>
        
        <div class="result-section">
            <h3>💎 종합 분석</h3>
            <h4>성격 특성</h4>
            <p>${analysisData.summary.personality}</p>
            
            <h4>강점</h4>
            <ul>
                ${analysisData.summary.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
            
            <h4>도전 과제</h4>
            <ul>
                ${analysisData.summary.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
            
            <h4>조언</h4>
            <p>${analysisData.summary.advice}</p>
        </div>
        
        <button onclick="generatePDF()" style="margin-top: 30px;">
            📄 PDF로 저장
        </button>
        
        <button onclick="startNewAnalysis()" style="margin-top: 10px; background: #718096;">
            🔄 새로 분석하기
        </button>
    `;
}

// 새 분석 시작
function startNewAnalysis() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('input-form').style.display = 'block';
    document.getElementById('birth-form').reset();
}

// PDF 생성 (임시 구현)
function generatePDF() {
    alert('PDF 생성 기능은 곧 추가될 예정입니다.');
}
