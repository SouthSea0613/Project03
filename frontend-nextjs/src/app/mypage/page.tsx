'use client';

import withAuth from "@/hocs/withAuth";

function MyPage() {
    // 이 컴포넌트는 withAuth HOC에 의해 인증된 사용자만 볼 수 있습니다.

    // HOC에서 사용자 정보를 fetch하여 props로 내려주도록 확장할 수도 있습니다.
    // const { user } = props;

    return (
        <div>
            <h1>마이페이지</h1>
            <p>이 페이지는 로그인한 사용자만 볼 수 있는 비밀 페이지입니다.</p>
        </div>
    );
}

// MyPage 컴포넌트를 withAuth로 감싸서 export 합니다.
export default withAuth(MyPage);