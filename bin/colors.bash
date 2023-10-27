# A list of color codes that can be used with echo.
# From: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux

# These variables are used only in files that source this one.
# So disable the undefined variable rule.
# shellcheck disable=SC2034

NO_COLOR='\033[0m'

# Text colors
BLACK='\033[0;30m'
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'

# Bold text colors
BOLD_BLACK='\033[1;30m'
BOLD_RED='\033[1;31m'
BOLD_GREEN='\033[1;32m'
BOLD_YELLOW='\033[1;33m'
BOLD_BLUE='\033[1;34m'
BOLD_PURPLE='\033[1;35m'
BOLD_CYAN='\033[1;36m'
BOLD_WHITE='\033[1;37m'

# Underline
UNDERLINE_BLACK='\033[4;30m'
UNDERLINE_RED='\033[4;31m'
UNDERLINE_GREEN='\033[4;32m'
UNDERLINE_ORANGE='\033[4;33m'
UNDERLINE_BLUE='\033[4;34m'
UNDERLINE_PURPLE='\033[4;35m'
UNDERLINE_CYAN='\033[4;36m'
UNDERLINE_WHITE='\033[4;37m'

# Highlighted background
ON_BLACK='\033[40m'
ON_RED='\033[41m'
ON_GREEN='\033[42m'
ON_ORANGE='\033[43m'
ON_BLUE='\033[44m'
ON_PURPLE='\033[45m'
ON_CYAN='\033[46m'
ON_WHITE='\033[47m'
