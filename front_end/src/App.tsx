// src/App.tsx

import {type JSX, useEffect, useState} from "react";
import axios, {type AxiosResponse } from "axios"; // AxiosResponse 타입을 임포트하여 응답 객체 전체를 타이핑할 수 있습니다.

function App(): JSX.Element { // 컴포넌트의 반환 타입을 JSX.Element로 명시합니다.
    // useState의 제네릭(<string>)을 사용하여 hello 상태의 타입을 string으로 명시합니다.
    // 초기값이 ''이므로 TypeScript가 string으로 추론하지만, 명시적으로 작성하는 것이 좋습니다.
    const [hello, setHello] = useState<string>('');

    useEffect(() => {
        // API 응답 데이터의 타입을 string으로 가정합니다.
        // 만약 백엔드에서 JSON 객체 (예: { message: "안녕하세요" })를 반환한다면,
        // interface ResponseData { message: string; } 와 같이 타입을 정의하고
        // axios.get<ResponseData>('/api/test').then(res => setHello(res.data.message)) 와 같이 사용합니다.
        axios.get<string>('/api/test') // get 요청의 응답 데이터 타입을 string으로 명시
            .then((response: AxiosResponse<string>) => { // response 객체와 그 안의 data 타입을 명시
                setHello(response.data);
            })
            .catch(error => {
                console.error("데이터를 가져오는 중 오류 발생:", error);
                // 사용자에게 오류를 알리는 UI를 추가할 수 있습니다.
                setHello("데이터 로딩 실패");
            });
    }, []); // useEffect의 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 한 번만 실행됩니다.

    return (
        <div className="App">
            백엔드 데이터 : {hello}
        </div>
    );
}

export default App;