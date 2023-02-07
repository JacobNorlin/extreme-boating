import { Quest } from "w3ts";


class WrappedQuest{
    private quest: Quest | null = null;

    init() {
        this.quest = new Quest();
        this.quest.setTitle('Debug log');
    }

    setDescription(desc: string) {
        if (this.quest) {
            this.quest.setDescription(desc);
        }
    }
}

export const wrapped = new WrappedQuest();

let currentLogMessages: string[] = [];

export class Logger{
    //We use the quest log as a log container....
    private prefix: string;
    constructor(name: string, private quest: WrappedQuest) {
        this.prefix = `${name}: `;
    }

    static getInstance(name: string) {
        return new Logger(name, wrapped);
    }

    log(msg: string) {
        if (currentLogMessages.length > 100) {
            currentLogMessages.shift();
        }
        
        currentLogMessages.push(this.getFormattedMessage(msg));
        this.updateQuest();
    }

    warn(msg: string) {
        const warnMsg = `WARNING - ${this.getFormattedMessage(msg)}`;
        currentLogMessages.push(warnMsg);
        this.updateQuest();
    }

    private getFormattedMessage(msg: string) {
        return `${this.prefix} ${msg}`;
    }

    private updateQuest() {
        this.quest.setDescription(currentLogMessages.join('\n'));
    }
}