' SortingSource Local Engine - Silent Background Launcher
' This script starts the Python backend silently with no terminal window.

Dim oShell, oFSO, projectPath, pythonCmd

Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

' --- CONFIGURATION ---
' This path is automatically set to the project folder.
projectPath = oFSO.GetParentFolderName(WScript.ScriptFullName)

' --- FIND PYTHON ---
' Try 'python' first, then fall back to 'py' launcher
pythonCmd = "python"

' --- LAUNCH SILENTLY ---
' 0 = hidden window, False = don't wait for completion
oShell.Run "cmd /c cd /d """ & projectPath & """ && " & pythonCmd & " -m uvicorn main:app --host 0.0.0.0 --port 8000 >> """ & projectPath & "\local_engine.log"" 2>&1", 0, False

WScript.Quit
