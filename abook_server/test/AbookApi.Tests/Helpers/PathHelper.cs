using System;
using System.IO;
using System.Reflection;

namespace AbookApi.Tests.Helpers
{
    public static class PathHelper
    {
        public static string GetPath(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var codeBaseUrl = new Uri(Assembly.GetExecutingAssembly().Location);
            var codeBasePath = Uri.UnescapeDataString(codeBaseUrl.AbsolutePath);
            var dirPath = Path.GetDirectoryName(codeBasePath);
            return Path.Combine(dirPath, name);
        }

        public static string GetResourcePath()
        {
            return GetPath("Resources");
        }

        public static string GetResourcePath(string name, string ext = null)
        {
            if (string.IsNullOrEmpty(ext))
            {
                ext = Path.GetExtension(name);
                name = name.Remove(name.Length - ext.Length);
            }

            return Path.Combine(GetResourcePath(), $"{name.Replace(".", "/")}{ext}");
        }
    }
}
