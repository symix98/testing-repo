export enum DateAgo {
    Today = "Today",
    Earlier = "Earlier",
    Yesterday = "Yesterday",
    Two_Days_Ago = "Two Days Ago"
}

export enum FormType {
    Default = "Default",
    Doct = "Doct",
    RSF = "RSF",
    Doc = "DOC"
}

export enum IconsAvailable {
    Draft = "pi pi-clock",
    InReview = "pi pi-eye",
    Committed = "pi pi-check",
    Approved = "pi pi-check",
    ToRevise = "pi pi-refresh",
    VisualInspectionComplete = "pi pi-file",
    Welded = "pi pi-cog",
    ReadyForWelding = "pi pi-tag",
    Requested = "pi pi-book",
    Tested = "pi pi-cog",
    Closed = "pi pi-lock",
    Cancelled = "pi pi-times",
    Completed = "pi pi-check"
}

export enum OperatorsList {
    Contains = "like",
    DoesNotContains = "not like",
    In = "in",
    StartsWith = "like",
    EndsWith = "like",
    Equals = "=",
    NotEquals = "!=",
    LessThan = "<",
    LessThanOrEqual = "<=",
    GreaterThan = ">",
    GreaterThanOrEqual = ">=",
    StartsWithString = "StartsWithString"
}

export const DefaultOperatorsList = [
    { label: 'Contains', operation: OperatorsList.Contains },
    { label: 'Does not contains', operation: OperatorsList.DoesNotContains },
    { label: 'In', operation: OperatorsList.In },
    { label: 'Starts With', operation: OperatorsList.StartsWith },
    { label: 'Ends With', operation: OperatorsList.EndsWith },
    { label: 'Equals', operation: OperatorsList.Equals },
    { label: 'Not Equals', operation: OperatorsList.NotEquals },
    { label: 'Greater Than', operation: OperatorsList.GreaterThan },
    { label: 'Greater Than or Equal', operation: OperatorsList.GreaterThanOrEqual },
    { label: 'Less Than', operation: OperatorsList.LessThan },
    { label: 'Less Than or Equal', operation: OperatorsList.LessThanOrEqual }
];

export const NumberDateOperatorsList = [
    { label: 'Equals', operation: OperatorsList.Equals },
    { label: 'Not Equals', operation: OperatorsList.NotEquals },
    { label: 'Greater Than', operation: OperatorsList.GreaterThan },
    { label: 'Greater Than or Equal', operation: OperatorsList.GreaterThanOrEqual },
    { label: 'Less Than', operation: OperatorsList.LessThan },
    { label: 'Less Than or Equal', operation: OperatorsList.LessThanOrEqual }
];

export const BooleanOperatorList = [
    { label: 'Equals', operation: OperatorsList.Equals },
    { label: 'Not Equals', operation: OperatorsList.NotEquals }
];
