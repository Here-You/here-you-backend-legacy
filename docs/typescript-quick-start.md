# Typescript 빠르게 시작하기

> 이 문서는 제가 2022년에 다른 팀을 교육하기 위해서 작성했던 문서에 몇가지 내용을 추가한 버전입니다.\
> 한 문서만 읽고도 바로 Typescript를 시작하기 위한 목적으로 작성되었기 때문에, 불명확하거나 현재는 잘못된 정보가 있을 수 있습니다.\
> 가이드 정도로만 사용하시고, 정확한 정보는 반드시 공식 문서를 참고하시기 바랍니다.

## 목차
1. [Typescript가 뭔가요? 왜 생겼나요?](#1-typescript가-뭔가요-왜-생겼나요)
2. [어떻게 사용하나요?](#2-어떻게-사용하나요)
3. [Typescript Cheat Sheet](#3-typescript-cheat-sheet)
4. [가장 많이 헷갈리는 부분들](#4-가장-많이-헷갈리는-부분들)

---

## 1. Typescript가 뭔가요? 왜 생겼나요?

### 1.1 Typescript가 뭔가요?

> Typescript는 Javascript에 타입 선언을 추가한 언어입니다,

Javascript는 데이터의 타입을 명시적으로 지정하지 않기 때문에 초보자들이 접하기 쉽지만, 많은 문제들을 안고 있기도 했습니다.\
Typescript는 이러한 문제들을 해결하기 위해 2012년, Microsoft에 의해 만들어졌습니다.

Typescript는 독립적인 언어가 아니며, Javascript의 Superset입니다.\
즉, Javascript와 완전히 호환되며 (Javascript의 모든 기능을 그대로 사용할 수 있으며) Type과 관련된 기능들이 추가되었을 뿐입니다.

그리고, Typescript는 단독으로 동작할 수 없습니다.\
작성된 Typescript 코드는 Typescript 컴파일러, Babel등을 통해 Javascript 코드로 변환됩니다.\
**즉, Typescript 코드는 Javascript 코드로 변환되어야만 실행될 수 있습니다.**

### 1.2. 왜 명시적 타입 선언이 필요한가요?

가장 큰 이유는 개발/디버깅 생산성의 증대입니다.\
예를 들어 다음 코드를 보겠습니다.
```javascript
let onCount = 0;
```
억지 좀 부려보자면, 코드의 맥락을 모르고서는 `onCount` 변수가 `on`의 횟수를 세는 용도로 사용되는지, `count`가 호출되었을 때 이벤트로 사용되는지 알 수 없습니다. (이벤트 리스너는 보통 `on`으로 시작합니다.)\
이러한 문제는 코드의 규모가 커질수록 더욱 심각해집니다. (물론, 이러한 문제를 해결하기 위해 주석을 사용할 수 있지만, 주석은 코드의 가독성을 떨어뜨리는 요소이기도 합니다.)

이는 Object에서도 마찬가지입니다. 한 부서에서 User를 저장하는 Object를 만들었다고 가정하겠습니다.
```javascript
let user = {
    name: 'John',
    age: 30,
};
```
다른 부서에서 이 데이터를 다뤄야 할 때, 예시 데이터를 보지 않고서 데이터의 구조를 알 수 있을까요?\
Typescript는 이 문제를 명시적 타입 선언으로 해결합니다.

```typescript
// onCount 변수를 number 타입으로 선언합니다.
let onCount: number = 0;
```
```typescript
// IUser라는 User Interface를 생성합니다.
interface IUser {
  name: string;
  age: number;
}

// IUser 타입의 user 변수를 생성합니다.
let user: IUser = {
  name: 'John',
  age: 30,
};
```

그리고 개발자가 실수로라도 잘못된 타입의 데이터를 넣게 되면, Typescript 컴파일러가 이를 감지하여 오류를 발생시킵니다.
```typescript
let onCount: number = 0;

onCount = 'EVIL DATA'; // 컴파일 오류 발생
```


## 2. 어떻게 사용하나요?

### 2.1. 기본 타입

Javascript의 원시 타입(Primitive Type)에는 다음과 같은 종류가 있습니다.
- String
- Number
- BigInt
- Boolean
- Symbol
- Null
- undefined

Typescript는 여기에 몇가지 기본 타입을 추가합니다.
- Array - 우리가 잘 아는 배열입니다. 주로 `[]`를 사용하여 선언합니다.
- Object - 우리가 잘 아는 객체입니다. 주로 `{}`를 사용하여 선언합니다.
- Tuple - 고정된 길이의 배열입니다. 주로 `[number, string]`과 같이 선언합니다.
- Enum - 열거형입니다. 주로 `enum { A, B, C }`와 같이 선언합니다.
- Any - 모든 타입을 허용합니다. 주로 `any`와 같이 선언합니다.
- Void - 아무것도 반환하지 않는 함수의 반환 타입입니다. 주로 `void`와 같이 선언합니다.
- Null - `null` 타입입니다.
- Undefined - `undefined` 타입입니다.
- Never - 절대 발생하지 않는 값의 타입입니다. 주로 `never`와 같이 선언합니다.

느낌이 잘 안 오시나요? 실 사용 사례를 [3. Typescript Cheat Sheet](#3-typescript-cheat-sheet)에서 설명하고 있으니, 간단하게만 짚고 넘어가도 좋습니다.

### 2.2. 타입 선언

아래 예시를 통해 타입 선언 방법을 알아보겠습니다.
```typescript
const str: string = 'hi'; // str라는 string 타입 상수를 선언합니다.
const num: number = 123; // num이라는 number 타입 상수를 선언합니다.

const arr1: number[] = [1, 2, 3]; // arr이라는 number 타입 배열을 선언합니다.
const arr2: Array<number> = [1, 2, 3]; // 이렇게도 선언할 수 있습니다.

const obj1: object = {}; // Object입니다. 그런데 이렇게 선언할 일은 거의 없습니다.
const obj2: { name: string; age: number } = { name: 'John', age: 30 }; // 보통 이렇게 선언합니다.
```
이렇게 Typescript에서는 `:`를 통해 변수/상수의 타입을 지정합니다.\
이는 함수에서도 마찬가지입니다.
```typescript
function add(x: number, y: number): number { // x와 y는 number 타입이며, 반환 타입은 number입니다.
  return x + y;
}

function printName(name: string): void { // name은 string 타입이며, 반환 타입은 void입니다.
  console.log(name);
}
```
Any, Void는 생소할 수 있습니다. 이런 값들은 이렇게 사용합니다.
```typescript
const x: any = 123; // x에는 모든 타입의 값이 들어갈 수 있습니다. 그런데 이렇게 사용하면 안 됩니다!

const y: void = undefined; // 변수에 void가 설정되면 undefined와 null만 할당할 수 있습니다.
function print(): void { // 함수의 반환 타입으로 void를 사용하면 아무것도 반환하지 않습니다.
  console.log('Hello World!');
}
```

### 2.3. Interface와 Type alias

Typescript에서는 `Interface`와 `Type` alias를 통해 타입을 정의할 수 있습니다.\
예를 들어, 다음과 같이 `IUser`라는 Interface를 정의할 수 있습니다.
```typescript
interface IUser {
  name: string;
  age: number;
}
```
이렇게 정의한 뒤, 변수 타입을 `IUser`로 지정할 수 있습니다.
```typescript
const user: IUser = {
  name: 'John',
  age: 30,
};
```

`Type` alias는 긴 타입을 짧게 쓸 수 있습니다.\
예를 들어 이런 타입이 있다고 가정하겠습니다.
```typescript
const sampleData: Array<Array<Array<{ name: string; value: Array<number> }>>> = [];
```
이 타입을 선언때마다 쓸 생각을 하니 끔찍합니다. 이를 `Type` alias를 통해 간단하게 쓸 수 있습니다.
```typescript
type SampleDataType = Array<Array<Array<{ name: string; value: Array<number> }>>>;

const sampleData: SampleDataType = [];
```

### 2.4. Generic
- 작성중

### 2.5. Type Operator
- 작성중

## 3. Typescript Cheat Sheet

이 장에서는 자주 사용하는 Typescript 패턴에 대해 예시를 통해 간단히 알아봅니다.

### 3.1. Object 선언

```typescript
// name과 age를 가진 Object 선언
const obj1: { name: string; age: number } = { name: 'John', age: 30 };

// Interface 사용
interface UserInterface {
  name: string;
  age: number;
}
const obj2: UserInterface = { name: 'John', age: 30 };

// Type 사용 (가급적 Interface를 사용하세요.)
type UserType = { name: string; age: number };
const obj3: UserType = { name: 'John', age: 30 };



// 키를 지정하지 않은 Object 선언
const obj4: {
  [key: string]: number
} = {
  'key1': 1,
  'key2': 2,
};
// 이렇게도 쓸 수 있습니다.
const obj5: Record<string, number> = {
  'key1': 1,
  'key2': 2,
};

// 유저의 입력을 받을 때 가장 많이 사용하는 패턴입니다.
const obj6: Record<string, unknown> = {
  'key1': 'string',
  'key2': 3,
  'key3': false,
};
```

### 3.2. Array 선언
```typescript
// number로 구성된 배열 만들기
const numberArray1: Array<number> = [1, 2, 3];
const numberArray2: number[] = [1, 2, 3];

// number와 string으로 구성된 배열 만들기
const numStrArray1: Array<number | string> = [1, '2', 3];
const numStrArray2: (number | string)[] = [1, '2', 3];

// Object를 원소로 가진 배열 만들기
const objArray1: Array<{ name: string; age: number }> = [{ name: 'Join', age: 30 }, { name: 'Park', age: 15 }];
const objArray2: { name: string; age: number }[] = [{ name: 'Join', age: 30 }, { name: 'Park', age: 15 }];
```

## 4. 가장 많이 헷갈리는 부분들

### 4.1. Typescript는 컴파일 과정에서 타입을 체크합니다.

Typescript는 컴파일 과정에서 타입을 체크합니다.\
이 말은 즉, **개발자의 실수는 걸러낼 수 있지만 유저의 실수는 걸러낼 수 없습니다.**

아래와 같은 함수를 생각해봅시다.
```typescript
function add(x: number, y: number): number {
  return x + y;
}
```
여기에서 개발자가 `add(1, '2')`와 같이 잘못된 타입의 값을 넣게 되면, Typescript 컴파일러가 이를 감지하여 오류를 발생시킵니다.\
그런데 만약, 이 함수를 유저가 사용할 수 있도록 했다면 어떨까요?\
유저가 string을 넣던, number를 넣던 에러가 발생하지 않습니다. (이는 작성한 Typescript 코드가 Javascript로 변환되었기 때문입니다.)\
즉, 유저가 `add('1', '2')`를 입력하면 `3`이 아니라 `'12'`가 나오게 됩니다.\
그렇기 때문에 반드시 유저의 데이터는 다시 한번 검증해야 합니다.