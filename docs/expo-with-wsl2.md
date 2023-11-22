## Connecting Expo with WSL2

WSL2 causes issues with Expo ports and must be configured to enable passing/proxying ports. Sources include ([Stack Overflow - WSL2 via LAN](https://stackoverflow.com/a/65295187/4206438)) and [GitHub - WSL2 Bridge Mode](https://github.com/microsoft/WSL/issues/4150).

- Allow Expo ports through Windows Firewall
- Proxy Expo ports to WSL2
- Update Expo QR address
- _Cleaning up_

> **NOTE:** This has been implemented as a [script](../scripts/wsl2_unlock_ports.ps1) that can be executed with administrator privileges. A shortcut can be created with a target of `powershell.exe -ExecutionPolicy Bypass -f <file_path>` to automatically configure when executed (ensure shortcut has admin privileges)!

### Configure Windows Firewall

Configure the Windows Firewall to let inbound/outbound traffic on Expo ports through.

```ps1
# Powershell

Remove-NetFireWallRule -DisplayName 'WSL2 Forwarded Ports';
New-NetFireWallRule -DisplayName 'WSL2 Forwarded Ports' -Direction Inbound -LocalPort 8081 -Action Allow -Protocol TCP;
New-NetFireWallRule -DisplayName 'WSL2 Forwarded Ports' -Direction Outbound -LocalPort 8081 -Action Allow -Protocol TCP;
```

### Proxy Expo Ports

Configure the port proxying from Windows host to WSL2 guest ports.

```ps1
# Powershell

$wsl_ip = $(wsl hostname -I).Trim();
$all_ips = '0.0.0.0';

netsh interface portproxy add v4tov4 listenport=8081 listenaddress=$windows_ip connectport=8081 connectaddress=$all_ips;

# Validate proxies
Invoke-Expression "netsh interface portproxy show v4tov4";
```

### Update Expo QR Address

Expo must also be updated to change the scannable QR code JS bundle address!

> **NOTE:** If developing on a machine using a Wi-Fi connection instead of Ethernet, the IP address must selected from the "Wi-Fi" adapter instead (will not work otherwise)!

```sh
# WSL Bash

npm run start:wsl
```

#### Manual

```sh
# WSL Bash

# Modify Expo QR address (for scanning with phone)
windows_ip=$(netsh.exe interface ip show address "Ethernet" | grep 'IP Address' | sed -r 's/^.*IP Address:\W*//');
export REACT_NATIVE_PACKAGER_HOSTNAME=$windows_ip;

# Start Metro bundler
npm run start
```

### Cleaning Up

Cleanup can be performed by removing the Windows Firewall exception and port proxies.

```ps1
# Powershell

# Remove port proxies
Invoke-Expression "netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0"

# Remove firewall rules
Invoke-Expression "Remove-NetFireWallRule -DisplayName 'WSL2 Forwarded Ports' ";
```
