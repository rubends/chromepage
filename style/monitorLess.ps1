### WHICH FILES TO WATCH
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = "D:\xampp\htdocs\sites\Chromepage\style"
    $watcher.Filter = "*.less"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true  

### ACTION ON FILE CHANGE
    $action = { 
		lessc -x style.less style.min.css
              }    

### WATCH ON FILE CHANGE
    Register-ObjectEvent $watcher "Changed" -Action $action
    while ($true) {sleep 5}