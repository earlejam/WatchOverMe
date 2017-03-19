module.exports = [{  
   "type":"section",
   "items":[  
      {  
         "type":"heading",
         "defaultValue":"Timer Settings"
      },
     {
        "type": "input",
        "messageKey": "minutes",
        "defaultValue": "",
        "label": "Default Timer(Minutes)",
        "attributes": {
          "placeholder": 1,
          "min": 1,
          "max": 999,
          "limit": 3,
          "type": "number"
        }
     },
     {  
         "type":"heading",
         "defaultValue":"Quick select timer values"
      },
     {
          "type": "checkboxgroup",
          "appKey": "quick_select_timers",
          "label": "Minute Values",
          "defaultValue": ["1", "5"],
          "options": [
            { 
              "label": "1", 
              "value": 1 
            },
            { 
              "label": "2", 
              "value": 2
            },
            { 
              "label": "5", 
              "value": 5 
            },
            { 
              "label": "10", 
              "value": 10 
            },
            { 
              "label": "15", 
              "value": 15 
            },
            { 
              "label": "20", 
              "value": 20
            },
            { 
              "label": "25", 
              "value": 25 
            },
            { 
              "label": "30", 
              "value": 30 
            },
          ]
        },
   ]
}];
