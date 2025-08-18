"use client";

import React, { useMemo, useState } from "react";

/**
 * =========================
 * 매뉴얼: CSS Counter로 번호가 "자동"으로 바뀌는 원리
 * =========================
 *
 * "CSS가 다시 그린다"는 의미 (핵심 요약):
 * - JavaScript가 HTML을 다시 만드는 것이 아님 (innerHTML 재생성 X)
 * - DOM 구조는 그대로 유지 (남은 요소들의 순서 유지)
 * - CSS 엔진이 남은 요소들의 ::before content만 "자동"으로 다시 그림
 * - 즉, 브라우저 CSS 렌더링 엔진이 "번호만" 재계산
 *
 * 왜 빠른가?
 * - JavaScript로 인덱스 재계산/상태 업데이트 없음
 * - Virtual DOM diff 없음
 * - HTML 재생성 없음
 * - DOM 조작 최소화 (삭제 시 remove()만 실행)
 * - 번호 계산은 CSS 엔진의 네이티브(C++ 구현) 경로에서 즉시 처리
 *
 * 언제 특히 좋은가?
 * - "순번/행번호"처럼 구조가 동일하고, 값이 규칙적으로 변하는 경우
 * - 대량 목록에서 "번호만" 바뀌면 되는 경우
 *
 * 유의사항
 * - 서버로 실제 "번호 값"을 보내야 하는 로직이라면, CSS 카운터는 표현용이므로 JS로 값 관리 필요
 * - 스크린리더 접근성: ::before 텍스트가 읽히지 않을 수 있어 aria-label 등 보완 권장
 */

// 데모용 더미 데이터
function makeItems(n: number) {
    const arr = new Array(n).fill(0).map((_, i) => ({
        id: i + 1,
        name: `사용자 #${i + 1}`,
        email: `user${i + 1}@example.com`,
    }));
    return arr;
}
type Item = ReturnType<typeof makeItems>[number];

// CSS Counter 전용 패널 컴포넌트 (default export)
export default function UsersRemotePanelCSS() {
    // 데모 크기: 기본 100개
    const initial = useMemo(() => makeItems(100), []);
    const [beforeItems, setBeforeItems] = useState<Item[]>(initial);
    const [afterItems, setAfterItems] = useState<Item[]>(initial);

    // BEFORE: 번호를 JS 상태/계산에 의존(삭제 후 인덱스 기반 표기)
    const removeBefore = (id: number) => {
        setBeforeItems((prev) => {
            const next = prev.filter((x) => x.id !== id);
            // 번호를 상태로 들고 있다면 여기서 재계산이 필요함(설명 목적의 주석)
            return next;
        });
    };

    // AFTER: 번호는 CSS Counter에게 위임(삭제만 실행)
    const removeAfter = (id: number) => {
        setAfterItems((prev) => prev.filter((x) => x.id !== id));
        // 번호는 CSS가 자동 재계산하여 출력
    };

    const resetBoth = () => {
        setBeforeItems(initial);
        setAfterItems(initial);
    };

    return (
        <div
            style={{
                padding: 24,
                fontFamily: "ui-sans-serif, system-ui, -apple-system",
            }}
        >
            <h1
                style={{
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 8,
                }}
            >
                CSS Counter로 “번호만” 자동 업데이트 매뉴얼
            </h1>
            <p
                style={{
                    color: "#555",
                    marginBottom: 24,
                }}
            >
                항목을 삭제해도 <b>DOM 변경은 최소화</b>하고,{" "}
                <b>번호는 CSS가 자동으로</b> 다시 그리도록 구성할 수 있습니다. 이는
                불필요한 JavaScript 로직/리렌더를 줄여 <b>성능과 단순성</b>을 동시에
                확보합니다.
            </p>

            {/* Step by Step */}
            <Manual />

            {/* 설치 가이드 */}
            <GuideSection title="1) 패키지 설치">
                <CodeBlock
                    language="bash"
                    code={`npm i react-syntax-highlighter\n# 또는\nyarn add react-syntax-highlighter`}
                />
            </GuideSection>

            {/* 핵심 CSS 가이드 */}
            <GuideSection title="2) 핵심 CSS: counter-reset / counter-increment / ::before">
                <CodeBlock
                    language="css"
                    code={`/* 컨테이너가 번호를 1로 초기화 */
.counter-container {
  counter-reset: item-counter;
}

/* 각 항목 노출마다 +1 */
.counter-item {
  counter-increment: item-counter;
}

/* 번호를 화면에 출력 (JS 없이!) */
.counter-item::before {
  content: counter(item-counter) ". ";
  font-weight: bold;
  color: #2563eb;
}`}
                />
            </GuideSection>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8, margin: "24px 0" }}>
                <button onClick={resetBoth} style={btn()}>
                    초기화(리스트 100명으로 복원)
                </button>
            </div>

            {/* BEFORE: JS 인덱스 관리 데모 */}
            <section style={section()}>
                <h2 style={h2()}>Before: JavaScript로 번호 관리 (인덱스 의존)</h2>
                <p style={desc()}>
                    삭제 시 상태 배열을 갱신하고, 번호 표시는 <b>JS 계산(index + 1)</b>에
                    의존합니다. 데이터가 클수록{" "}
                    <b>불필요한 재계산</b>과 <b>리렌더</b>가 발생할 수 있습니다.
                </p>
                <div style={panel()}>
                    {beforeItems.map((item, idx) => (
                        <div key={item.id} style={row()}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <Badge>{idx + 1}</Badge>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                                    <div style={{ color: "#666", fontSize: 12 }}>{item.email}</div>
                                </div>
                            </div>
                            <button onClick={() => removeBefore(item.id)} style={delBtn()}>
                                삭제
                            </button>
                        </div>
                    ))}
                    {beforeItems.length === 0 && <Empty />}
                </div>

                <GuideSection title="Before 구현 요약 코드">
                    <CodeBlock
                        language="tsx"
                        code={`// 번호 표시가 JS 인덱스 계산에 의존
{beforeItems.map((item, idx) => (
  <div key={item.id} style={row()}>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge>{idx + 1}</Badge>
      <div>
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div style={{ color: '#666', fontSize: 12 }}>{item.email}</div>
      </div>
    </div>
    <button onClick={() => removeBefore(item.id)} style={delBtn()}>삭제</button>
  </div>
))}`}
                    />
                </GuideSection>
            </section>

            {/* AFTER: CSS counter 데모 */}
            <section style={section()}>
                <h2 style={h2()}>After: CSS Counter로 자동 번호 (JS는 remove만)</h2>
                <p style={desc()}>
                    삭제 시 <code>remove()</code>만 실행합니다. 번호는 <code>counter()</code>
                    규칙에 따라{" "}
                    <code>::before</code> 가상요소로 <b>CSS 엔진이 자동 재계산</b>하여 출력합니다.
                    Virtual DOM diff, 인덱스 재계산, HTML 재생성이 모두 불필요합니다.
                </p>

                <div className="counter-container" style={panel()}>
                    {afterItems.map((item) => (
                        <div key={item.id} className="counter-item" style={row()}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {/* 번호는 ::before에서 자동 출력됩니다 */}
                                <div>
                                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                                    <div style={{ color: "#666", fontSize: 12 }}>{item.email}</div>
                                </div>
                            </div>
                            <button onClick={() => removeAfter(item.id)} style={delBtn()}>
                                삭제
                            </button>
                        </div>
                    ))}
                    {afterItems.length === 0 && <Empty />}
                </div>

                <GuideSection title="After 구현 요약 코드">
                    <CodeBlock
                        language="tsx"
                        code={`// 번호는 CSS Counter가 ::before로 자동 출력
<div className="counter-container">
  {afterItems.map((item) => (
    <div key={item.id} className="counter-item" style={row()}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{item.name}</div>
          <div style={{ color: '#666', fontSize: 12 }}>{item.email}</div>
        </div>
      </div>
      <button onClick={() => removeAfter(item.id)} style={delBtn()}>삭제</button>
    </div>
  ))}
</div>

// 핵심 CSS
.counter-container { counter-reset: item-counter; }
.counter-item { counter-increment: item-counter; }
.counter-item::before { content: counter(item-counter) ". "; }`}
                    />
                </GuideSection>
            </section>

            {/* 성능 쿡북 */}
            <PerfNotes />

            {/* CSS Counter 전역 스타일 */}
            <style jsx global>{`
        .counter-container {
          counter-reset: item-counter;
        }
        .counter-item {
          counter-increment: item-counter;
          position: relative;
          padding-left: 44px; /* 번호 공간 */
        }
        .counter-item::before {
          content: counter(item-counter) '.';
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 800;
          color: #2563eb;
          min-width: 20px;
          text-align: right;
        }
      `}</style>
        </div>
    );
}

/** =========================
 *  보조 컴포넌트/스타일
 *  ========================= */
function btn() {
    return {
        padding: "10px 16px",
        background: "#2563eb",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 700,
    } as React.CSSProperties;
}
function section() {
    return { marginBottom: 40 } as React.CSSProperties;
}
function h2() {
    return {
        fontSize: 20,
        fontWeight: 800,
        margin: "0 0 8px",
    } as React.CSSProperties;
}
function desc() {
    return {
        color: "#444",
        margin: "0 0 12px",
        lineHeight: 1.6,
    } as React.CSSProperties;
}
function panel() {
    return {
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#fff",
        maxHeight: 480,
        overflow: "auto",
    } as React.CSSProperties;
}
function row() {
    return {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: 10,
        margin: "6px 0",
        border: "1px solid #f1f5f9",
        borderRadius: 10,
        background: "#f8fafc",
    } as React.CSSProperties;
}
function delBtn() {
    return {
        padding: "6px 10px",
        background: "#ef4444",
        color: "#fff",
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
    } as React.CSSProperties;
}
function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 800,
                fontSize: 12,
            }}
        >
            {children}
        </span>
    );
}
function Empty() {
    return (
        <div
            style={{
                padding: 24,
                textAlign: "center",
                color: "#6b7280",
                fontStyle: "italic",
            }}
        >
            목록이 비었습니다.
        </div>
    );
}

/** =========================
 *  매뉴얼(정중한 설명)
 *  ========================= */
function Manual() {
    return (
        <section style={section()}>
            <h2 style={h2()}>Step-by-Step: “CSS가 다시 그린다”의 의미</h2>
            <ol style={{ lineHeight: 1.8, marginLeft: 18 }}>
                <li>
                    <b>DOM은 그대로 유지됩니다.</b> 항목을 하나 삭제하면 해당{" "}
                    <code>&lt;div&gt;</code>만 제거되고, 나머지 형제 요소의 구조와 순서는
                    변하지 않습니다.
                </li>
                <li>
                    <b>표시 레이어를 분리합니다.</b> 번호 텍스트는 <code>::before</code>
                    가상요소의 <code>content</code>로 표시되며,
                    <code>counter()</code>가 현재 요소 순서를 기준으로 값을 만듭니다.
                </li>
                <li>
                    <b>CSS 엔진이 번호를 재계산합니다.</b> <code>counter-reset</code> /{" "}
                    <code>counter-increment</code> 규칙에 따라 남은 항목에 대한 번호만
                    재계산됩니다.
                </li>
                <li>
                    <b>JavaScript 개입이 없습니다.</b> 번호 재생성을 위한 별도의 루프나 상태
                    업데이트 없이, 렌더링 파이프라인의{" "}
                    <b>스타일 계산 및 페인트</b> 단계에서 해결됩니다.
                </li>
                <li>
                    <b>따라서 빠릅니다.</b> Virtual DOM diff, 템플릿 재생성, 인덱스 재계산
                    등이 필요하지 않습니다. 네이티브 엔진(C++) 경로에서{" "}
                    <b>번호만</b> 즉시 반영됩니다.
                </li>
            </ol>
        </section>
    );
}

/** =========================
 *  성능 팁/쿡북
 *  ========================= */
function PerfNotes() {
    return (
        <section style={section()}>
            <h2 style={h2()}>성능 체크리스트</h2>
            <ul style={{ lineHeight: 1.8, marginLeft: 18 }}>
                <li>JavaScript 실행 최소화(번호 계산을 JS로 하지 않음)</li>
                <li>Virtual DOM diff 불필요</li>
                <li>HTML 재생성 없음</li>
                <li>DOM 조작 최소화(<code>element.remove()</code> 하나로 충분)</li>
                <li>브라우저 CSS 엔진(C++)이 번호를 네이티브로 처리</li>
            </ul>

            <h3
                style={{
                    marginTop: 12,
                    marginBottom: 8,
                    fontWeight: 800,
                    fontSize: 16,
                }}
            >
                적용이 적합한 장면
            </h3>
            <ul style={{ lineHeight: 1.8, marginLeft: 18 }}>
                <li>테이블/리스트 행 번호, 순번 표시</li>
                <li>섹션/헤더 자동 목차 번호</li>
                <li>삭제/정렬 등 구조만 바뀌고 “표시 번호”만 달라질 때</li>
            </ul>

            <h3
                style={{
                    marginTop: 12,
                    marginBottom: 8,
                    fontWeight: 800,
                    fontSize: 16,
                }}
            >
                유의사항
            </h3>
            <ul style={{ lineHeight: 1.8, marginLeft: 18 }}>
                <li>서버 전송 등 실제 “번호 값”이 필요하면 JS로 값을 관리해야 합니다.</li>
                <li>
                    접근성: <code>::before</code> 콘텐츠는 스크린리더가 건너뛸 수 있으므로{" "}
                    <code>aria-label</code> 등 보완이 필요합니다.
                </li>
                <li>중첩 카운터(예: 1.1, 1.2 …) 사용 시 규칙을 명확히 설계하십시오.</li>
            </ul>
        </section>
    );
}

/** =========================
 *  가이드 섹션 & 코드 블록
 *  ========================= */
function GuideSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section style={{ marginBottom: 24 }}>
            <h3
                style={{
                    fontSize: 16,
                    fontWeight: 800,
                    margin: "0 0 8px",
                }}
            >
                {title}
            </h3>
            <div>{children}</div>
        </section>
    );
}

// 하이라이터 의존성 제거를 위한 단순 CodeBlock 구현
function CodeBlock({
    language,
    code,
}: {
    language: string;
    code: string;
}) {
    return (
        <pre
            style={{
                borderRadius: 10,
                fontSize: 13,
                padding: 12,
                background: "#0f172a",
                color: "#e2e8f0",
                overflowX: "auto",
            }}
        >
            <code>{code}</code>
        </pre>
    );
}
