// 간단한 main.js - 기본 기능부터 시작
console.log('🔮 운명학 시스템 로딩 시작');

// 전역 변수
let analysisData = {};

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM 로딩 완료');
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    console.log('🚀 앱 초기화 시작');
    
    // 폼 요소 찾기
    const form = document.getElementById('birth-form');
    if (form) {
        console.log('✅ 폼 찾음');
        form.addEventListener('submit', handleFormSubmit);
        console.log('✅ 폼 이벤트 연결됨');
    } else {
        console.error('❌ 폼을 찾을 수 없음');
    }
    
    // 기본 폼 설정
    setupBasicForm();
}

// 기본 폼 설정 (HTML에 드롭다운이 없는 경우 대비)
function setupBasicForm() {
    // 성별 선택 개선
    const genderSelect = document.getElementById('gender');
    if (genderSelect && genderSelect.type === 'select-one') {
        console.log('✅ 기본 성별 드롭다운 사용');
    }
}

// 폼 제출 처리
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('🚀 폼 제출 시작');
    
    // 입력값 수집 (기본 HTML 폼 기준)
    const birthDate = document.getElementById('birth-date');
    const birthTime = document.getElementById('birth-time');
    const birthLocation = document.getElementById('birth-location');
    const gender = document.getElementById('gender');
    
    if (!birthDate || !birthTime || !birthLocation || !gender) {
        console.error('❌ 필수 입력 필드를 찾을 수 없음');
        alert('폼 설정에 문제가 있습니다. 페이지를 새로고침하고 다시 시도해주세요.');
        return;
    }
    
    const birthData = {
        date: birthDate.value,
        time: birthTime.value,
        location: birthLocation.value,
        gender: gender.value
    };
    
    console.log('📋 입력 데이터:', birthData);
    
    // 유효성 검사
    if (!validateInputs(birthData)) {
        return;
    }
    
    console.log('✅ 유효성 검사 통과');
    
    // 분석 시작
    try {
        showLoadingScreen();
        await performAnalysis(birthData);
        showResults();
    } catch (error) {
        console.error('❌ 분석 오류:', error);
        alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        hideLoadingScreen();
    }
}

// 유효성 검사
function validateInputs(data) {
    console.log('🔍 유효성 검사:', data);
    
    if (!data.date) {
        alert('출생일을 입력해주세요.');
        return false;
    }
    
    if (!data.time) {
        alert('출생시간을 입력해주세요.');
        return false;
    }
    
    if (!data.location.trim()) {
        alert('출생지를 입력해주세요.');
        return false;
    }
    
    if (!data.gender) {
        alert('성별을 선택해주세요.');
        return false;
    }
    
    return true;
}

// 로딩 화면 표시
function showLoadingScreen() {
    console.log('⏳ 로딩 화면 표시');
    const inputForm = document.getElementById('input-form');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    
    if (inputForm) inputForm.style.display = 'none';
    if (results) results.style.display = 'block';
    if (loading) loading.style.display = 'block';
    
    const analysisResults = document.getElementById('analysis-results');
    if (analysisResults) analysisResults.style.display = 'none';
}

// 로딩 화면 숨김
function hideLoadingScreen() {
    console.log('🔄 로딩 화면 숨김');
    const inputForm = document.getElementById('input-form');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    
    if (loading) loading.style.display = 'none';
    if (inputForm) inputForm.style.display = 'block';
    if (results) results.style.display = 'none';
}

// 결과 표시
function showResults() {
    console.log('📊 결과 표시');
    const loading = document.getElementById('loading');
    const analysisResults = document.getElementById('analysis-results');
    
    if (loading) loading.style.display = 'none';
    if (analysisResults) {
        analysisResults.style.display = 'block';
        analysisResults.innerHTML = generateResultsHTML();
    }
}

// 분석 수행
async function performAnalysis(birthData) {
    console.log('🔮 분석 시작');
    
    // 로딩 메시지 업데이트
    updateLoadingMessage('천문학적 계산 중...');
    await delay(1000);
    
    updateLoadingMessage('사주팔자 분석 중...');
    await delay(1000);
    
    // 사주 계산 (실제 계산기가 있으면 사용, 없으면 임시 데이터)
    let baziResult;
    if (window.baziCalculator) {
        console.log('✅ 실제 사주 계산기 사용');
        baziResult = window.baziCalculator.calculate(birthData);
    } else {
        console.log('⚠️ 임시 사주 데이터 사용');
        baziResult = generateTempBaziData(birthData);
    }
    
    updateLoadingMessage('서양점성술 분석 중...');
    await delay(1000);
    
    const westernResult = generateWesternData(birthData);
    
    updateLoadingMessage('종합 해석 생성 중...');
    await delay(1000);
    
    // 분석 데이터 저장
    analysisData = {
        birthInfo: birthData,
        bazi: baziResult,
        western: westernResult,
        summary: generateSummary(baziResult, birthData)
    };
    
    console.log('✅ 분석 완료:', analysisData);
}

// 로딩 메시지 업데이트
function updateLoadingMessage(message) {
    const loadingText = document.querySelector('#loading p');
    if (loadingText) {
        loadingText.textContent = message;
        console.log('📢', message);
    }
}

// 지연 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 임시 사주 데이터 생성
function generateTempBaziData(birthData) {
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 출생 데이터 기반으로 약간의 패턴 적용
    const date = new Date(birthData.date);
    const yearIndex = date.getFullYear() % 10;
    const monthIndex = (date.getMonth() + 1) % 12;
    const dayIndex = date.getDate() % 10;
    const timeIndex = parseInt(birthData.time.split(':')[0]) % 12;
    
    return {
        fourPillars: {
            year: tianGan[yearIndex] + diZhi[yearIndex % 12],
            month: tianGan[(yearIndex + 2) % 10] + diZhi[monthIndex],
            day: tianGan[dayIndex] + diZhi[(dayIndex + 3) % 12],
            hour: tianGan[(dayIndex + 4) % 10] + diZhi[timeIndex]
        },
        fiveElements: {
            木: Math.floor(Math.random() * 3) + 1,
            火: Math.floor(Math.random() * 3) + 1,
            土: Math.floor(Math.random() * 3) + 1,
            金: Math.floor(Math.random() * 3) + 1,
            水: Math.floor(Math.random() * 3) + 1
        }
    };
}

// 서양점성술 데이터 생성
function generateWesternData(birthData) {
    const date = new Date(birthData.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 간단한 태양궁 계산
    let sunSign = '양자리';
    if (month === 12 && day >= 22 || month === 1 && day <= 19) sunSign = '염소자리';
    else if (month === 1 && day >= 20 || month === 2 && day <= 18) sunSign = '물병자리';
    else if (month === 2 && day >= 19 || month === 3 && day <= 20) sunSign = '물고기자리';
    else if (month === 3 && day >= 21 || month === 4 && day <= 19) sunSign = '양자리';
    else if (month === 4 && day >= 20 || month === 5 && day <= 20) sunSign = '황소자리';
    else if (month === 5 && day >= 21 || month === 6 && day <= 20) sunSign = '쌍둥이자리';
    else if (month === 6 && day >= 21 || month === 7 && day <= 22) sunSign = '게자리';
    else if (month === 7 && day >= 23 || month === 8 && day <= 22) sunSign = '사자자리';
    else if (month === 8 && day >= 23 || month === 9 && day <= 22) sunSign = '처녀자리';
    else if (month === 9 && day >= 23 || month === 10 && day <= 22) sunSign = '천칭자리';
    else if (month === 10 && day >= 23 || month === 11 && day <= 21) sunSign = '전갈자리';
    else if (month === 11 && day >= 22 || month === 12 && day <= 21) sunSign = '사수자리';
    
    const signs = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', 
                   '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
    
    return {
        sunSign: sunSign,
        moonSign: signs[Math.floor(Math.random() * 12)],
        ascendant: signs[Math.floor(Math.random() * 12)]
    };
}

// 종합 요약 생성
function generateSummary(baziResult, birthData) {
    return {
        personality: '창의적이고 직관적인 성향을 가지고 있으며, 감정이 풍부하고 예술적 감각이 뛰어납니다.',
        strengths: [
            '뛰어난 직감력과 통찰력',
            '창의적 사고와 예술적 감각',
            '깊은 공감능력과 이해심'
        ],
        challenges: [
            '때로는 완벽주의 성향',
            '감정의 기복 관리 필요',
            '결정 내리기를 어려워함'
        ],
        advice: '내면의 목소리에 귀 기울이고, 명상이나 요가를 통해 마음의 평정을 찾으세요. 창작 활동을 통해 감정을 표현하는 것이 도움이 될 것입니다.'
    };
}

// 결과 HTML 생성
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
        </div>
        
        <div class="result-section">
            <h3>🌟 서양점성술</h3>
            <p><strong>태양:</strong> ${western.sunSign}</p>
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
            
            <h4>💡 인생 조언</h4>
            <p>${summary.advice}</p>
        </div>
        
        <div class="text-center" style="margin-top: 30px;">
            <button onclick="startNewAnalysis()" style="background: #718096; margin-right: 10px;">
                🔄 새로 분석하기
            </button>
            <button onclick="alert('PDF 기능은 곧 추가됩니다!')" style="background: #38a169;">
                📄 PDF 저장
            </button>
        </div>
    `;
}

// 새 분석 시작
function startNewAnalysis() {
    console.log('🔄 새 분석 시작');
    
    const results = document.getElementById('results');
    const inputForm = document.getElementById('input-form');
    const form = document.getElementById('birth-form');
    
    if (results) results.style.display = 'none';
    if (inputForm) inputForm.style.display = 'block';
    if (form) form.reset();
}

console.log('✅ main.js 로딩 완료');
