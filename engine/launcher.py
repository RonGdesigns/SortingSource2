import sys
import os

# 1. THE PATH FIX (Must happen before anything else)
if hasattr(sys, '_MEIPASS'):
    os.chdir(sys._MEIPASS)
    sys.path.append(sys._MEIPASS)

# 2. THE SILENCE FIX (Stops the terminal crash)
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

# 3. BOOT THE SCRAMBLED ENGINE
# This looks for the 'main.py' inside the 'dist' folder that PyArmor made
try:
    import main
    # If your main.py uses the "if __name__ == '__main__':" block, 
    # we don't need to do anything else. It will start on import.
except Exception as e:
    # This will finally show us an error if it fails!
    with open("crash_log.txt", "w") as f:
        f.write(str(e))
    raise e