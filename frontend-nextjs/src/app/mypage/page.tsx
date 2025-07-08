'use client';

import withAuth from "@/hocs/withAuth";

function MyPage() {
    return (
        <div>
            <h1>마이페이지</h1>
            <p>이 페이지는 로그인한 사용자만 볼 수 있는 비밀 페이지입니다.</p>
        </div>
    );
}

// MyPage 컴포넌트를 withAuth로 감싸서 export 합니다.
export default withAuth(MyPage);