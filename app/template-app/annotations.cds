using msgMasterData as service from '../../srv/cat-service';
annotate service.templates with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : vendor,
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
                Value : templateID,
            },
            {
                $Type : 'UI.DataField',
                Value : content,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Template configuration Details',
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
            Value : documentType,
        },
        
        {
            $Type : 'UI.DataField',
            Value : msgType,
        },
        {
            $Type : 'UI.DataField',
            Value : templateID,
        },
        {
            $Type : 'UI.DataField',
            Value : content,
        },
    ],
);



