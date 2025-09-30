# Connecting Expo with WSL2

Developing in WSL has a few caveats but can work quite well once setup. There are a couple issues to resolve, including forwarding WSL ports to Windows host, and enabling Chrome debugging (optional).

> [!Note]
> In order to run EAS Build locally, an Android development setup must be configured _within_ WSL (_should_ be able to work with installed dev client builds otherwise)!

WSL ports must be forwarded to Windows host to allow connecting to Expo (or other ports) from another device on the network (ie. phone). This can be accomplished with a PowerShell script (see [gist](https://gist.github.com/kendallroth/1f4871febffa0577338214f58673cc1a)). Additionally, Expo must be configured to start the dev server on the host's IP address (already handled with `start:wsl` command).

> [!Note]
> More information can be found at ([Stack Overflow - WSL2 via LAN](https://stackoverflow.com/a/65295187/4206438)) and [GitHub - WSL2 Bridge Mode](https://github.com/microsoft/WSL/issues/4150).

- Allow Expo ports through Windows Firewall
- Proxy Expo ports to WSL2
- Update Expo QR address
- _Cleaning up_

> [!Note]
> This has been implemented as a [script](../scripts/wsl2_unlock_ports.ps1) that can be executed with administrator privileges. A shortcut can be created with a target of `powershell.exe -ExecutionPolicy Bypass -f <file_path>` to automatically configure when executed (ensure shortcut has admin privileges)!

## Configure Windows Firewall

Configure the Windows Firewall to let inbound/outbound traffic on Expo ports through.

```ps1
# Powershell

Remove-NetFireWallRule -DisplayName 'Expo WSL2 Ports';
New-NetFireWallRule -DisplayName 'Expo WSL2 Ports' -Direction Inbound -LocalPort 19000-19006 -Action Allow -Protocol TCP;
New-NetFireWallRule -DisplayName 'Expo WSL2 Ports' -Direction Outbound -LocalPort 19000-19006 -Action Allow -Protocol TCP;
```

## Proxy Expo Ports

Configure the port proxying from Windows host to WSL2 guest ports.

```ps1
# Powershell

$wsl_ip = $(wsl hostname -I).Trim();
$windows_ip = '0.0.0.0';

netsh interface portproxy add v4tov4 listenport=19000 listenaddress=$windows_ip connectport=19000 connectaddress=$wsl_ip;
netsh interface portproxy add v4tov4 listenport=19001 listenaddress=$windows_ip connectport=19001 connectaddress=$wsl_ip;

# Validate proxies
Invoke-Expression "netsh interface portproxy show v4tov4";
```

> [!Note]
> Avoid proxying port `19002` as this will prevent loading the Expo dev tools on the host!

## Update Expo QR Address

Expo must also be updated to change the scannable QR code JS bundle address!

> [!Note]
> If developing on a machine using a Wi-Fi connection instead of Ethernet, the IP address must selected from the "Wi-Fi" adapter instead (will not work otherwise)!

```sh
# WSL Bash

npm run start:wsl
```

> **TODO:** Determine if still valid with Expo Dev Client builds (vs Expo Go)...

### Manual

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
Invoke-Expression "netsh int portproxy delete reset all"

# Remove firewall rules
Invoke-Expression "Remove-NetFireWallRule -DisplayName 'Expo WSL2 Ports' ";
```

## Chrome Debugging

Enabling Chrome debugging with Expo can be accomplished by installing the GUI version of Google Chrome in WSL ([instructions](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps#install-google-chrome-for-linux)), then ensuring the Expo CLI has been patched to avoid attempting to open Chrome in Windows for WSL (patch is already configured). If running `google-chrome` from within WSL works properly, then the Expo CLI should be able to open the debugging tools (once connected to a running app) from WSL.
