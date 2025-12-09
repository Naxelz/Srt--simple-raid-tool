using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.IO;
using DiscordRPC;
using Button = System.Windows.Controls.Button;
using MessageBox = System.Windows.MessageBox;

namespace SimpleRaidTool;

public partial class MainWindow : Window
{
    private DiscordRpcClient? _rpcClient;

    public MainWindow()
    {
        InitializeComponent();
        InitializeRpc();
    }

    private void InitializeRpc()
    {
        try
        {
            _rpcClient = new DiscordRpcClient(RpcConfig.ClientId);
            _rpcClient.Initialize();

            _rpcClient.SetPresence(new RichPresence()
            {
                Details = RpcConfig.Details,
                State = RpcConfig.State,
                Assets = new Assets()
                {
                    LargeImageKey = RpcConfig.LargeImageKey,
                    LargeImageText = RpcConfig.LargeImageText,
                    SmallImageKey = RpcConfig.SmallImageKey,
                    SmallImageText = RpcConfig.SmallImageText
                }
            });
        }
        catch { }
    }

    protected override void OnClosed(EventArgs e)
    {
        _rpcClient?.Dispose();
        base.OnClosed(e);
    }

    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.LeftButton == MouseButtonState.Pressed)
        {
            this.DragMove();
        }
    }

    private void MinimizeButton_Click(object sender, RoutedEventArgs e)
    {
        this.WindowState = WindowState.Minimized;
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        this.Close();
    }

    private void RaidButton_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button button && button.Tag is string command)
        {
            string token = TokenBox.Text;
            string guildId = GuildIdBox.Text;
            string channelName = ChannelNameBox.Text;
            string roleName = RoleNameBox.Text;
            string spamMsg = SpamMsgBox.Text;

            if (string.IsNullOrWhiteSpace(token))
            {
                MessageBox.Show("Por favor, introduce el Token del bot.", "Falta Token", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrWhiteSpace(guildId) && !command.StartsWith("token."))
            {
                MessageBox.Show("Por favor, introduce el ID del servidor.", "Falta Guild ID", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string scriptPath = Path.Combine(baseDir, "raid.js");

                if (!File.Exists(scriptPath))
                {
                    if (File.Exists("raid.js"))
                    {
                        scriptPath = Path.GetFullPath("raid.js");
                    }
                    else
                    {
                        MessageBox.Show($"No se encontró el archivo 'raid.js' en {baseDir}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                }

                System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/k node \"{scriptPath}\" {command} \"{token}\" \"{guildId}\" \"{channelName}\" \"{roleName}\" \"{spamMsg}\"",
                    UseShellExecute = true,
                    CreateNoWindow = false,
                    WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal
                };

                System.Diagnostics.Process.Start(startInfo);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al iniciar el proceso: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
