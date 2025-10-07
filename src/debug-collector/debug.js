const hide = (id, e) => {
    e.preventDefault();
    const sectionPre = document.getElementById(id);
    // sectionPre?.style.setProperty('display', 'none');
    sectionPre?.parentElement.classList.remove('showing');
    sectionPre?.parentElement.classList.add('hidden');
}

const show = (id, e) => {
    e.preventDefault();
    const sectionPre = document.getElementById(id);
    // sectionPre?.style.setProperty('display', 'block');
    sectionPre?.parentElement.classList.remove('hidden');
    sectionPre?.parentElement.classList.add('showing');
}