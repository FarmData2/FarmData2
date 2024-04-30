# Working on Documentation

- Details coming soon.

==

Uses the Vale linter.

If you change .vale.ini then must run vale sync

How to disable a rule:

```html
<!-- vale RedHat.DoNotUseTerms = NO : give an explanation -->
You can turn off a specific rule for a block of text.
<!-- vale RedHat.DoNotUseTerms = YES -->

You can turn off <!-- vale RedHat.DoNotUseTerms = NO : give an explanation -->a specific rule for part of<!-- vale RedHat.DoNotUseTerms = YES --> a block of text.
```

Note: Sometimes vale will not detect the disabling of the rules. When this happens try applying it to a larger block of text. For example to an entire bullet in a list.

```html
<!-- vale off : give an explanation -->
You can turn off all Vale rules for a block of text
<!-- vale on -->

You can turn off <!-- vale off : give an explanation -->all Vale rules for part of<!-- vale on --> a block of text.
```
