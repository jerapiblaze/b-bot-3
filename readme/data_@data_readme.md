json
filename structure: `${server_id}_${type}.json`

example: `123456789012345678_pageSettings.json`
```json
{
    "page_code":{
        "tags":[
            {   "name":"tag_name",
                "censor":true,
                "icon":"🤡",
                "note":"tag's note/warning"
            }
        ],
        "prefix":{
            "censor":".",
            "showTagNote":true,
            "pageHastag":true,
        },
        "surfix":{
            "cfsIndexType":"id, counter, none",
            "showDate":true,
            "note":"Ghi nhớ: đọc cfs với một chiếc đầu lạnh, suy nghĩ kĩ rồi mới hành động"
        },
        "modAliases":{
            "user_id":"alias"
        }
    }
}
```

example: `123456789012345678_pageConters.json`
```json
{
    "page_code":0
}
```