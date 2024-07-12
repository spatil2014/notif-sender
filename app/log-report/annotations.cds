using msgTransactionData as service from '../../srv/cat-service';
annotate service.log with @(
    UI.DeleteHidden: true,
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : vendor,
            },
            {
                $Type : 'UI.DataField',
                Value : msgType,
            },
            {
                $Type : 'UI.DataField',
                Value : documentType,
            },
            {
                $Type : 'UI.DataField',
                Value : documentRef,
            },
            {
                $Type : 'UI.DataField',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Value : messageContent,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : vendor,
        },
        {
            $Type : 'UI.DataField',
            Value : documentRef,
        },
        {
            $Type : 'UI.DataField',
            Value : documentType,
        },
        {
            $Type : 'UI.DataField',
            Value : msgType,
        },
        {
            $Type : 'UI.DataField',
            Value : status,
        },
    ]
);
