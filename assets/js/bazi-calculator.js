// 실제 사주팔자 계산을 위한 새로운 JavaScript 파일
// assets/js/bazi-calculator.js 로 저장하세요

class BaziCalculator {
    constructor() {
        // 천간 (10개)
        this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        
        // 지지 (12개)
        this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 오행 분류
        this.wuXing = {
            '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
            '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
            '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
            '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
        };
        
        // 음양 분류
        this.yinYang = {
            '甲': '陽', '乙': '陰', '丙': '陽', '丁': '陰', '戊': '陽',
            '己': '陰', '庚': '陽', '辛': '陰', '壬': '陽', '癸': '陰',
            '子': '陽', '丑': '陰', '寅': '陽', '卯': '陰', '辰': '陽', '巳': '陰',
            '午': '陽', '未': '陰', '申': '陽', '酉': '陰', '戌': '陽', '亥': '陰'
        };
        
        // 절기 정보 (간단 버전)
        this.solarTerms = [
            { name: '입춘', month: 2, day: 4 },
            { name: '경칩', month: 3, day: 6 },
            { name: '청명', month: 4, day: 5 },
            { name: '입하', month: 5, day: 6 },
            { name: '망종', month: 6, day: 6 },
            { name: '소서', month: 7, day: 7 },
            { name: '입추', month: 8, day: 8 },
            { name: '백로', month: 9, day: 8 },
            { name: '한로', month: 10, day: 8 },
            { name: '입동', month: 11, day: 7 },
            { name: '대설', month: 12, day: 7 },
            { name: '소한', month: 1, day: 6 }
        ];
    }
    
    // 메인 계산 함수
    calculate(birthData) {
        const date = new Date(birthData.date + 'T' + birthData.time);
        
        return {
            fourPillars: this.calculateFourPillars(date),
            fiveElements: this.analyzeFiveElements(date),
            yinYangBalance: this.analyzeYinYang(date),
            seasonAnalysis: this.analyzeSeason(date),
            tenGods: this.calculateTenGods(date),
            luckyElements: this.determineLuckyElements(date),
            interpretation: this.generateInterpretation(date, birthData)
        };
    }
    
    // 사주팔자 계산 (년월일시)
    calculateFourPillars(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        
        return {
            year: this.getYearPillar(year),
            month: this.getMonthPillar(year, month, day),
            day: this.getDayPillar(year, month, day),
            hour: this.getHourPillar(hour, this.getDayPillar(year, month, day))
        };
    }
    
    // 년주 계산
    getYearPillar(year) {
        // 기원년 기준 계산 (간단 버전)
        const baseYear = 1924; // 甲子년
        const yearDiff = year - baseYear;
        
        const ganIndex = yearDiff % 10;
        const zhiIndex = yearDiff % 12;
        
        return this.tianGan[ganIndex] + this.diZhi[zhiIndex];
    }
    
    // 월주 계산
    getMonthPillar(year, month, day) {
        // 절기 기준으로 월주 결정 (간단 버전)
        let adjustedMonth = month;
        
        // 절기 체크 (간단화)
        if (day < 6) {
            adjustedMonth = month - 1;
            if (adjustedMonth <= 0) adjustedMonth = 12;
        }
        
        const yearGanIndex = this.tianGan.indexOf(this.getYearPillar(year)[0]);
        const monthGanIndex = (yearGanIndex * 2 + adjustedMonth + 1) % 10;
        const monthZhiIndex = (adjustedMonth + 1) % 12;
        
        return this.tianGan[monthGanIndex] + this.diZhi[monthZhiIndex];
    }
    
    // 일주 계산 (만년력 기반 간단 버전)
    getDayPillar(year, month, day) {
        // 기준일로부터 계산 (1900.1.1 = 甲戌일 기준)
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const dayDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        // 기준일의 간지 인덱스 (甲戌 = 0, 10)
        const baseGanIndex = 0; // 甲
        const baseZhiIndex = 10; // 戌
        
        const ganIndex = (baseGanIndex + dayDiff) % 10;
        const zhiIndex = (baseZhiIndex + dayDiff) % 12;
        
        return this.tianGan[ganIndex] + this.diZhi[zhiIndex];
    }
    
    // 시주 계산
    getHourPillar(hour, dayPillar) {
        // 시간대별 지지
        const hourZhiMap = [
            23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21
        ];
        
        let hourZhiIndex = 0;
        for (let i = 0; i < hourZhiMap.length; i++) {
            if (hour >= hourZhiMap[i] && hour < hourZhiMap[i] + 2) {
                hourZhiIndex = i;
                break;
            }
        }
        
        // 일간에 따른 시간 천간 계산
        const dayGanIndex = this.tianGan.indexOf(dayPillar[0]);
        const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
        
        return this.tianGan[hourGanIndex] + this.diZhi[hourZhiIndex];
    }
    
    // 오행 분석
    analyzeFiveElements(date) {
        const pillars = this.calculateFourPillars(date);
        const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
        
        // 각 기둥의 천간, 지지 오행 계산
        Object.values(pillars).forEach(pillar => {
            const gan = pillar[0];
            const zhi = pillar[1];
            elements[this.wuXing[gan]]++;
            elements[this.wuXing[zhi]]++;
        });
        
        return elements;
    }
    
    // 음양 분석
    analyzeYinYang(date) {
        const pillars = this.calculateFourPillars(date);
        let yangCount = 0, yinCount = 0;
        
        Object.values(pillars).forEach(pillar => {
            const gan = pillar[0];
            const zhi = pillar[1];
            
            if (this.yinYang[gan] === '陽') yangCount++;
            else yinCount++;
            
            if (this.yinYang[zhi] === '陽') yangCount++;
            else yinCount++;
        });
        
        return { 양: yangCount, 음: yinCount };
    }
    
    // 계절 분석
    analyzeSeason(date) {
        const month = date.getMonth() + 1;
        
        if (month >= 3 && month <= 5) return { season: '봄', element: '木', characteristic: '생발지기' };
        if (month >= 6 && month <= 8) return { season: '여름', element: '火', characteristic: '성장지기' };
        if (month >= 9 && month <= 11) return { season: '가을', element: '金', characteristic: '수렴지기' };
        return { season: '겨울', element: '水', characteristic: '저장지기' };
    }
    
    // 십신 계산 (간단 버전)
    calculateTenGods(date) {
        const pillars = this.calculateFourPillars(date);
        const dayGan = pillars.day[0]; // 일간이 기준
        
        // 십신 관계 매핑 (간단화)
        const tenGodsRelation = {
            same: '비견',
            similar: '겁재',
            child: '식신',
            childDiff: '상관',
            overcome: '편재',
            overcomeDiff: '정재',
            overcome_me: '편관',
            overcome_me_diff: '정관',
            generate_me: '편인',
            generate_me_diff: '정인'
        };
        
        return {
            year: this.getTenGodRelation(dayGan, pillars.year[0]),
            month: this.getTenGodRelation(dayGan, pillars.month[0]),
            hour: this.getTenGodRelation(dayGan, pillars.hour[0])
        };
    }
    
    // 십신 관계 계산
    getTenGodRelation(dayGan, targetGan) {
        const dayElement = this.wuXing[dayGan];
        const targetElement = this.wuXing[targetGan];
        const dayYinYang = this.yinYang[dayGan];
        const targetYinYang = this.yinYang[targetGan];
        
        if (dayElement === targetElement) {
            return dayYinYang === targetYinYang ? '비견' : '겁재';
        }
        
        // 오행 상생 상극 관계로 십신 결정 (간단화)
        const relation = this.getFiveElementRelation(dayElement, targetElement);
        
        switch (relation) {
            case 'generate': return targetYinYang === dayYinYang ? '식신' : '상관';
            case 'overcome': return targetYinYang === dayYinYang ? '편재' : '정재';
            case 'overcome_by': return targetYinYang === dayYinYang ? '편관' : '정관';
            case 'generated_by': return targetYinYang === dayYinYang ? '편인' : '정인';
            default: return '미정';
        }
    }
    
    // 오행 관계 판단
    getFiveElementRelation(element1, element2) {
        const relations = {
            '木': { generate: '火', overcome: '土' },
            '火': { generate: '土', overcome: '金' },
            '土': { generate: '金', overcome: '水' },
            '金': { generate: '水', overcome: '木' },
            '水': { generate: '木', overcome: '火' }
        };
        
        if (relations[element1].generate === element2) return 'generate';
        if (relations[element1].overcome === element2) return 'overcome';
        if (relations[element2].generate === element1) return 'generated_by';
        if (relations[element2].overcome === element1) return 'overcome_by';
        return 'neutral';
    }
    
    // 용신 결정 (간단 버전)
    determineLuckyElements(date) {
        const elements = this.analyzeFiveElements(date);
        const season = this.analyzeSeason(date);
        
        // 부족한 오행이나 계절에 필요한 오행을 용신으로
        const sortedElements = Object.entries(elements).sort((a, b) => a[1] - b[1]);
        const weakest = sortedElements[0][0];
        
        return {
            primary: weakest,
            secondary: season.element,
            avoid: sortedElements[sortedElements.length - 1][0]
        };
    }
    
    // 기본 해석 생성
    generateInterpretation(date, birthData) {
        const pillars = this.calculateFourPillars(date);
        const elements = this.analyzeFiveElements(date);
        const yinYang = this.analyzeYinYang(date);
        const season = this.analyzeSeason(date);
        const tenGods = this.calculateTenGods(date);
        
        const dayGan = pillars.day[0];
        const dayZhi = pillars.day[1];
        
        return {
            dayMaster: {
                gan: dayGan,
                element: this.wuXing[dayGan],
                yinyang: this.yinYang[dayGan],
                strength: this.calculateDayMasterStrength(pillars, season)
            },
            personality: this.getPersonalityByDayMaster(dayGan),
            career: this.getCareerTendency(dayGan, tenGods),
            relationships: this.getRelationshipTendency(pillars, birthData.gender),
            health: this.getHealthTendency(elements),
            fortune: this.getFortuneTendency(elements, season),
            advice: this.getLifeAdvice(dayGan, elements, season)
        };
    }
    
    // 일간 강약 계산 (간단 버전)
    calculateDayMasterStrength(pillars, season) {
        const dayGan = pillars.day[0];
        const dayElement = this.wuXing[dayGan];
        
        // 계절에 따른 강약
        let strength = 50; // 기본값
        
        if (season.element === dayElement) {
            strength += 20; // 득령
        }
        
        // 다른 기둥들의 지원 정도 계산
        Object.values(pillars).forEach(pillar => {
            if (this.wuXing[pillar[0]] === dayElement || this.wuXing[pillar[1]] === dayElement) {
                strength += 10;
            }
        });
        
        if (strength >= 80) return '극강';
        if (strength >= 60) return '강';
        if (strength >= 40) return '중';
        if (strength >= 20) return '약';
        return '극약';
    }
    
    // 일간별 성격 특성
    getPersonalityByDayMaster(dayGan) {
        const personalities = {
            '甲': '리더십이 강하고 진취적이며 정의감이 있습니다. 새로운 일을 시작하는 것을 좋아합니다.',
            '乙': '부드럽고 유연하며 적응력이 뛰어납니다. 예술적 감각과 섬세함을 가지고 있습니다.',
            '丙': '밝고 활발하며 사교적입니다. 열정적이고 남을 도우려는 마음이 큽니다.',
            '丁': '온화하고 신중하며 예의바릅니다. 정교한 일을 잘하고 배려심이 깊습니다.',
            '戊': '믿음직하고 안정적이며 포용력이 있습니다. 책임감이 강하고 현실적입니다.',
            '己': '신중하고 꼼꼼하며 인내심이 강합니다. 세심하고 계획적으로 일을 처리합니다.',
            '庚': '의지가 강하고 결단력이 있습니다. 정의감이 강하고 일에 대한 추진력이 뛰어납니다.',
            '辛': '세련되고 품위가 있으며 미적 감각이 뛰어납니다. 섬세하고 감성적입니다.',
            '壬': '지혜롭고 융통성이 있으며 포용력이 큽니다. 변화를 잘 받아들이고 적응력이 뛰어납니다.',
            '癸': '차분하고 내성적이며 깊이 있는 사고를 합니다. 인내심이 강하고 은근한 끈기가 있습니다.'
        };
        
        return personalities[dayGan] || '독특하고 개성적인 성향을 가지고 있습니다.';
    }
    
    // 직업 경향
    getCareerTendency(dayGan, tenGods) {
        const careers = {
            '甲': ['경영', '정치', '건설업', '임업', '교육'],
            '乙': ['예술', '디자인', '상담', '서비스업', '원예'],
            '丙': ['연예', '광고', '요식업', '에너지업', '스포츠'],
            '丁': ['요리', '제조업', '의료', '화학', '조명업'],
            '戊': ['부동산', '건설', '농업', '물류', '금융'],
            '己': ['농업', '도자기', '화장품', '식품', '섬유'],
            '庚': ['기계', '자동차', '군사', '수술', '금속업'],
            '辛': ['보석', '금융', '법무', '의료기기', '정밀기계'],
            '壬': ['해운', '수산업', '음료', '화학', '여행업'],
            '癸': ['연구', '의료', '주류', '청소', '수처리']
        };
        
        return careers[dayGan] || ['다양한 분야에서 활약 가능'];
    }
    
    // 인간관계 경향
    getRelationshipTendency(pillars, gender) {
        const dayGan = pillars.day[0];
        const spouseElement = gender === 'male' ? '재성' : '관성';
        
        return {
            marriage: '배우자와 조화로운 관계를 유지할 가능성이 높습니다.',
            friendship: '진실한 우정을 쌓아가는 타입입니다.',
            family: '가족에 대한 책임감이 강합니다.'
        };
    }
    
    // 건강 경향
    getHealthTendency(elements) {
        const weakElement = Object.entries(elements).sort((a, b) => a[1] - b[1])[0][0];
        
        const healthAdvice = {
            '木': '간 기능과 눈 건강에 주의하세요. 스트레스 관리가 중요합니다.',
            '火': '심장과 혈액순환에 신경 쓰세요. 충분한 휴식이 필요합니다.',
            '土': '소화기관 건강에 주의하세요. 규칙적인 식사가 중요합니다.',
            '金': '호흡기와 피부 건강을 챙기세요. 깨끗한 공기가 중요합니다.',
            '水': '신장과 생식기 건강에 주의하세요. 수분 섭취를 충분히 하세요.'
        };
        
        return healthAdvice[weakElement] || '전반적으로 균형 잡힌 건강 상태입니다.';
    }
    
    // 재운 경향
    getFortuneTendency(elements, season) {
        const strongestElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];
        
        if (strongestElement === '土') {
            return '부동산이나 안정적인 투자에서 좋은 결과를 얻을 수 있습니다.';
        } else if (strongestElement === '金') {
            return '금융업이나 귀금속 관련 투자에서 기회가 있을 수 있습니다.';
        } else if (strongestElement === '水') {
            return '유동성 있는 사업이나 해외 투자에서 성과를 낼 수 있습니다.';
        }
        
        return '꾸준한 노력을 통해 안정적인 재물을 축적할 수 있습니다.';
    }
    
    // 인생 조언
    getLifeAdvice(dayGan, elements, season) {
        const advice = [];
        
        // 일간별 기본 조언
        if (['甲', '乙'].includes(dayGan)) {
            advice.push('창의성을 발휘할 수 있는 환경을 만드세요.');
        } else if (['丙', '丁'].includes(dayGan)) {
            advice.push('열정을 적절히 조절하며 인내심을 기르세요.');
        } else if (['戊', '己'].includes(dayGan)) {
            advice.push('안정적인 기반을 다지며 꾸준히 노력하세요.');
        } else if (['庚', '辛'].includes(dayGan)) {
            advice.push('명확한 목표를 설정하고 집중력을 발휘하세요.');
        } else if (['壬', '癸'].includes(dayGan)) {
            advice.push('지혜로운 판단력을 바탕으로 유연하게 대처하세요.');
        }
        
        // 계절별 조언
        advice.push(`${season.season}에 태어나 ${season.characteristic}를 가지고 있으니, 때를 기다릴 줄 아는 지혜가 필요합니다.`);
        
        return advice;
    }
}

// 전역 인스턴스 생성
window.baziCalculator = new BaziCalculator();
