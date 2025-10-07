import { htmlReport, htmlSection, htmlSubSection } from './generate-html';
import { printToFile } from './print-to-file';

export type DebugCollector = {
    collection: {
        name: string,
        content: unknown,
        type: 'Section' | 'SubSection',
        startHidden: boolean,
        error: boolean
    }[],

    collect: (name: string, content: string, startHidden?: boolean) => void,

    error: (name: string, content: string, startHidden?: boolean) => void,

    createSubSection(name: string, startHidden?: boolean): DebugCollector,

    printSection: (id?: string) => string,

    printReport: () => void
};

export const getDebugCollector = (): DebugCollector => ({
    collection: [],

    collect(name: string, content: unknown, startHidden: boolean = true) {
        this.collection.push({ name, content, type: 'Section', startHidden, error: false });
    },

    error(name: string, content: string, startHidden: boolean = true) {
        this.collection.push({ name, content, type: 'Section', startHidden, error: true });
    },

    createSubSection(name: string, startHidden: boolean = true) {
        const subSection = getDebugCollector();
        this.collection.push({ name, content: subSection, type: 'SubSection', startHidden, error: false });
        return subSection;
    },

    printSection(id: string = '') {
        return this.collection.map((section, index) => {
            const nindex = index + 1;

            if (section.type === 'SubSection') {
                return htmlSubSection(
                    section.name,
                    (section.content as DebugCollector).printSection(`${id}${nindex}-`),
                    section.startHidden,
                    `section${id}${nindex}`
                )
            }

            return htmlSection(
                section.name,
                `${section.content}`,
                section.startHidden,
                `section${id}${nindex}`,
                section.error
            )
        }).join('');
    },

    printReport() {
        const sections = this.printSection();
        const html = htmlReport('Report', sections);

        printToFile(html);
    }
});