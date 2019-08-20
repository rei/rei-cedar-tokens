# ChangeLog

## v1.2
- Fixed Token Bugs
    - Prominence `X` offsets are `0`
    - Prominence-flat shadow opacity is fixed to be like its siblings
    - radius-round changed from `50%` to `9999px` so we get pill shape, not oval shape
- Added `sketch.json` output so we can automate token generation in sketch

### Breaking
- Updated Typography tokens
    - Added token sets:
        - Heading
        - Subheading
        - Display
    - Deprecated token sets:
        - Maple, Spruce, Redwood
        - Header 1-6
        - Editorial and Editoral-Compact
    - Updated all font-families, including mobile/native tokens: 
        - All `Roboto` refs are now `Graphik`
        - All `Sentinel` refs are now `REI Stuart`
- Large breakpoint changed from 1200px to 1232px