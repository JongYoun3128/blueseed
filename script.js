// 부드러운 스크롤
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
}

// 스크롤 애니메이션
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    // 애니메이션을 적용할 요소들 선택
    const elementsToAnimate = document.querySelectorAll(
        ".vision-content, .benefit-card, .essence-quote, .keywords-section, .positioning-section, .revenue-card, .revenue-summary, .stat-card, .stats-section, .story-content, .zero-card, .zero-faq"
    );

    elementsToAnimate.forEach((el) => {
        el.classList.add("fade-in");
        observer.observe(el);
    });
}
// 숫자 카운팅 애니메이션
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // 숫자 포맷팅
        const formatted = Math.floor(current).toLocaleString("ko-KR");
        element.textContent = formatted + (element.dataset.suffix || "");
    }, 16);
}

// 폼 제출 처리
function initFormSubmit() {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 제출 버튼 비활성화
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "전송 중...";
        submitBtn.disabled = true;

        // 폼 데이터 수집
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 연락처 조합
        const phone = `${data["phone-prefix"]}-${data["phone-middle"]}-${data["phone-last"]}`;

        // 구글 시트로 전송할 데이터 준비
        const submitData = {
            timestamp: new Date().toLocaleString("ko-KR"),
            name: data.name,
            phone: phone,
            location: data.location,
            message: data.message,
            privacy: data.privacy ? "동의" : "미동의",
        };

        //구글시트에 데이터 전송//
        const GOOGLE_SCRIPT_URL =
            "https://script.google.com/macros/s/AKfycbyrw4D0Ejz8LUWFsi8M4VlM0anXEsrnF7vyGBrJH2afbCR9ezdmdAcAUgRprCW9Cq4w/exec";

        try {
            // 구글 시트로 데이터 전송
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            // 성공 메시지
            alert(
                "문의가 성공적으로 접수되었습니다!\n빠른 시일 내에 연락드리겠습니다."
            );

            // 폼 초기화
            form.reset();
        } catch (error) {
            console.error("전송 오류:", error);
            alert(
                "문의 전송 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."
            );
        } finally {
            // 버튼 복원
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 전화번호 입력 제한
function initPhoneInputValidation() {
    const phoneInputs = document.querySelectorAll(
        'input[name="phone-middle"], input[name="phone-last"]'
    );

    phoneInputs.forEach((input) => {
        input.addEventListener("input", (e) => {
            // 숫자만 입력 가능
            e.target.value = e.target.value.replace(/[^0-9]/g, "");

            // 최대 길이 제한
            if (e.target.value.length > e.target.maxLength) {
                e.target.value = e.target.value.slice(0, e.target.maxLength);
            }
        });
    });
}

// 로딩 화면 처리
function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
            // 로딩 화면이 완전히 사라진 후 DOM에서 제거
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000); // 3초 후 로딩 화면 숨김
    }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initFormSubmit();
    initPhoneInputValidation();

    // 페이지 로드 시 맨 위로 스크롤
    window.scrollTo(0, 0);
});

// 페이지 완전 로드 후 로딩 화면 제거
window.addEventListener("load", () => {
    hideLoadingScreen();
});

// 페이지 새로고침 시 애니메이션 재생
window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});
const wait = () => {
    alert("준비중입니다.");
};
