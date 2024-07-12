using msgMasterData as service from '../../srv/cat-service';

annotate service.configuration with @(
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
                Value : apihost,
            },
            {
                $Type : 'UI.DataField',
                Value : port,
            },
            {
                $Type : 'UI.DataField',
                Value : username,
            },
            {
                $Type : 'UI.DataField',
                Value : password,
            },
            {
                $Type : 'UI.DataField',
                Value : sender,
            },
            {
                $Type : 'UI.DataField',
                Value : documentType,
            },
            {
                $Type : 'UI.DataField',
                Value : active,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Configuration Entry',
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
            Value : msgType,
        },
        {
            $Type : 'UI.DataField',
            Value : apihost,
        },
        {
            $Type : 'UI.DataField',
            Value : port,
        },
        {
            $Type : 'UI.DataField',
            Value : username,
        },
        {
            $Type : 'UI.DataField',
            Value : password,
        },
        {
            $Type : 'UI.DataField',
            Value : sender,
        },
        {
            $Type : 'UI.DataField',
            Value : documentType,
        },
        {
            $Type : 'UI.DataField',
            Value : active,
        },
    ],
);

