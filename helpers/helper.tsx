// export function showError(id: string, messages: string[]) {
//     removeError(id);
//     let input = document.getElementById(id);
//     input.classList.add('inputerror');
//     const errorMessage = document.createElement('div');
//     errorMessage.classList.add("messageerror");
//     errorMessage.id = "messageerror" + id;
//     for (let i = 0; i < messages.length; i++) {
//         if (i == messages.length - 1) {
//             errorMessage.innerHTML += messages[i];
//         } else {
//             errorMessage.innerHTML += messages[i] + "<br>";
//         }
//     }
//     input.insertAdjacentElement('afterend', errorMessage);
//     // input.parentElement.insertAdjacentElement('afterend', errorMessage);
// };

export function showError(id: string, messages: string[]) {
    removeError(id);

    const input = document.getElementById(id) as HTMLElement;
    input.classList.add('inputerror');

    const errorMessage = document.createElement('div');
    errorMessage.classList.add("messageerror");
    errorMessage.id = "messageerror" + id;
    errorMessage.innerHTML = messages.join("<br>");

    // أهم تعديل هنا:
    // لو parent عليه d-flex، نضيف الرسالة بعده مباشرة
    const parent = input.parentElement!;
    if (parent.classList.contains('d-flex')) {
        parent.insertAdjacentElement('afterend', errorMessage);
    } else {
        input.insertAdjacentElement('afterend', errorMessage);
    }
}


export function removeError(id: string) {
    let input = document.getElementById(id);
    input.classList.remove('inputerror');
    let errorMessage = document.getElementById("messageerror" + id);
    if (errorMessage != null) {
        errorMessage.remove();
    }
};

export function isEmail(s: string): boolean {
    const re = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
    return re.test(s.trim());
}