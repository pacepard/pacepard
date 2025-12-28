import { ObjectId } from 'mongoose';
import { ISubmissionDoc } from '../submission/submission.interface';
import { IHackathonDoc } from '../hackathon/hackathon.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { IUserDoc } from '../user/user.interface';


////////////////////////////////////////
// Form Builder Core
////////////////////////////////////////

// Forms are the building blocks of a workspace
// Forms is a container for drag and drop blocks
// its a collection of blocks that describe the form and what users answer.
export interface IFormDoc extends Document {
    code: string;

    name: string;
    status: FormStatusType; 
    hasDraftBlocks: boolean;
    index: number; // position of the form item in a list
    timeZone: string;
    
    type: FormType; //onboarding, entiries + submission , feedback, mentor, judging,
    blocks: Array<IBlock>; // UI Block layout 
    questions: Array<IQuestion>; // logical answerable questions from UI Blocks
    
    numberOfEntries: number;
    numberOfSubmissions: number;

    settings: IFormSettings 
    styles: Record<string, any>; // css 
    
    // relationships
    hackathon: IHackathonDoc | any;
    entries: Array<IEntryDoc | any>;
    submission: Array<ISubmissionDoc | any>;   


    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}



export interface IFormSettings {
    language: string;
    isClosed: boolean;
    closeTime: string;
    closeDate: string;
    closeTimeZone: string;
    closeMessageTitle: string;
    closeMessageDescription: string;
    submissionLimit: number;
};

export enum FormStatusType {
    BLANK = 'blank',
    DRAFT = 'draft',
    DELETED = 'deleted',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    TEMPLATE = 'template'
}

  
export enum FormType {
    REGISTRATION = 'hackathon-registration',
    ENTRIES = 'hackathon-entries',
    SUBMISSION = 'hackathon-submission',
    ENTRIES_AND_SUBMISSION = 'hackathon-entries-and-submission',
    FEEDBACK = 'hackathon-feedback',
    MENTOR = 'hackathon-mentor',
    JUDGING = 'hackathon-judging',
}


////////////////////////////////////////
// Blocks (UI)
////////////////////////////////////////

// blocks are the building blocks of a form
// Blocks describe how the form looks, not what users answer.
// notion-styled blocks are used to create the form
// they are used to create the form and what users answer.
export interface IBlock {
    code: string; // id of the UI Block
    name: string;
    type: BlockType; // actual element type
    description: string;
    groupId: string; // id of the group of the block
    groupType: BlockType; // what kind of container/group it belongs to
    question: IQuestion | any; // optional link if block is a question

    payload: IBlockPayload
    styles: Record<string, any>;

    isAnswerable: boolean
    isReadOnly: boolean;
    isHidden: boolean;
    
}


export interface IBlockPayload {
    isRequired: boolean;
    isFirst: boolean;
    isLast: boolean;
    index: number; // position of the block in the form
    placeholder: string;
    text: string;
    value: string;
    options: Array<string>;
    columnid: string;
    colunmListId: string;
    columnRatio: number;
    safeHTMLSchema: Array<[string, Array<[string, string]>] | [string]>;
    isThankYouPage: boolean;
    isQualifiedForThankYouPage: boolean;
};


export enum BlockType {
    // layout and structure
    FORM_TITLE = "form-title",
    TITLE = "title",
    LABEL = "label",
    TEXT = "text",
    HEADING_1 = "heading-1",
    HEADING_2 = "heading-2",
    HEADING_3 = "heading-3",
    DIVIDER = "divider",
    PAGE_BREAK = "page-break",
    THANK_YOU_PAGE = "thank-you-page",
  
    // question container
    QUESTION = "question",
  
    // input fields
    INPUT_TEXT = "input-text",
    INPUT_EMAIL = "input-email",
    INPUT_PHONE_NUMBER = "input-phone-number",
    INPUT_LINK = "input-link",
    INPUT_DATE = "input-date",
    INPUT_TIME = "input-time",
    INPUT_DATETIME = "input-datetime",
    TEXTAREA = "textarea",
    BOOLEAN = "boolean",
  
    // selection fields
    SELECT = "select",
    DROPDOWN = "dropdown",
    CHECKBOXES = "checkboxes",
    RADIO = "radio",
    MULTI_SELECT = "multi-select",
    MULTIPLE_CHOICE = "multiple-choice",
  
    // advanced inputs
    RATING = "rating",
    LINEAR_SCALE = "linear-scale",
    FILE_UPLOAD = "file-upload",
    RESPONDENT_COUNTRY = "respondent-country",
  
    // embeds
    EMBED = "embed",
    EMBED_IMAGE = "embed-image",
    EMBED_VIDEO = "embed-video",
  
    // logic and system blocks
    CONDITIONAL_LOGIC = "conditional-logic",
    HIDDEN_FIELDS = "hidden-fields",
    CALCULATED_FIELDS = "calculated-fields",

    // group blocks
    
    TABLE = "table",
    FORM = "form",
    SECTION = "section",
    GROUP = "group",
    COLUMN = "column",
    ROW = "row",
    GRID = "grid",
    LIST = "list",
    CARDS = "cards",
    CARDS_LIST = "cards-list",
    CARDS_GRID = "cards-grid",
    CARDS_TABLE = "cards-table",
    CARDS_FORM = "cards-form",
    CARDS_SECTION = "cards-section",
    CARDS_GROUP = "cards-group",
    CARDS_COLUMN = "cards-column",
  }
  





////////////////////////////////////////
// Questions (logic)
////////////////////////////////////////


// Questions are the building blocks of a form
// Questions describe what users answer (logical part).
// its a collection of blocks that describe the question and what users answer.
// not all blocks are questions, some are just text or images or conditionals
export interface IQuestion {
    code: string;

    fields: Array<IBlock>;  // blocks that are part of this question (input fields)
    
    questionType: IBlock
    
    options: Array<string>;
    isRequired: boolean;
    isFirst: boolean;
    isLast: boolean;
    index: number;

    numberOfResponses: number;
    hasResponses: boolean; // if the question has responses
}

export interface IResponse {
    code: string; // code;
    answer: string;
    respondent: IUserDoc; // user who answered the question
    question: IQuestion; 
    form: IFormDoc; // form that the question is part of
}


