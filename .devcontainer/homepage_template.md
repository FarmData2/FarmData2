<center>
  <h1>The FarmData2 Development Environment</h1>
  <h3>The Development Environment is Ready</h3>
</center>

<table>
    <tr>
        <td width=50% valign="top">
            <u><h3>Open in your Browser<sup>1</sup></h3></u>
            <!-- 
              CODESPACE_NAME and CACHE_KEY are replaced by homepage.bash
              The value of CACHE_KEY is set to the timestamp.
              This prevents the browser from using a cached version of the
              page, which does not work when the codespace is restarted.
            -->
            Click here to <a href="https://%CODESPACE_NAME%-6901.app.github.dev?autoconnect=true&resize=remote&key=%CACHE_KEY%" target="_blank">Open the Development Environment in a Browser Tab</a>.
            <br>
            <u><h3>Open on your Machine with VNC<sup>2,3</sup></h3></u>
            In a terminal on your machine:
            <ol>
                <li><code>gh cs ports forward 5901:5902 -c %CODESPACE_NAME%</code></li>
                <li>Use a VNC client to connect to <code>localhost:5902</code></li>
            </ol>
        </td>
        <td valign="center">
            <center>
                <img src="../docs/install/images/FD2-dev-env.jpg" alt="The FarmData2 Development Environment"/>
            </center>
        </td>
    </tr>
    <tr>
        <td colspan=2>
            <br>
            <i>Notes:</i> 
            <ol>
                <li>
                    The browser based version of the Development Environment has the limitation that you cannot copy and paste directly between the Development Environment and your machine. Using a VNC client on your machine as described in Note #2 removes this limitation.
                </li>
                <li>
                    Opening in VNC requires that both the <code>gh</code> command line interface and a VNC client be installed on your machine. You can find more information about each of these in the <a href="../docs/install/codespaces.md" target="_blank">installation documentation</a>.
                </li>
                <li>
                    The <code>gh cs ports forward 5901:5902</code> command forwards port <code>5901</code> in the codespace to port <code>5902</code> on your local machine to enable VNC to connect. If port <code>5902</code> is in use on your machine you can change <code>5902</code> to any available port. Then use your VNC client to connect to the new port.
                </li>
            </ol>
        </td>
    </tr>
</table>
