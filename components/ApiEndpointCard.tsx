import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/CopyButton";

interface ApiEndpointProps {
  method: string;
  path: string;
  description: string;
  auth?: boolean;
  adminOnly?: boolean;
  requestBody?: any;
  response?: any;
  baseUrl: string;
}

const ApiEndpointCard = ({
  method,
  path,
  description,
  auth,
  adminOnly,
  requestBody,
  response,
  baseUrl,
}: ApiEndpointProps) => {
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className={`${getMethodColor(method)} border`}>{method}</Badge>
        <code className="flex-1 font-mono text-sm">{path}</code>
        <CopyButton text={`${baseUrl}${path}`} />
      </div>

      <p className="mb-3 text-sm text-gray-700">{description}</p>

      <div className="mb-3 flex gap-2">
        {auth && (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            🔐 Authentication Required
          </Badge>
        )}
        {adminOnly && (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            👑 Admin Only
          </Badge>
        )}
      </div>

      {/* Request Body */}
      {requestBody && (
        <div className="mb-3">
          <h4 className="mb-2 font-semibold text-gray-900">Request Body:</h4>
          <div className="rounded bg-gray-50 p-3">
            <pre className="text-sm">
              {JSON.stringify(requestBody, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div>
          <h4 className="mb-2 font-semibold text-gray-900">Response:</h4>
          <div className="rounded bg-gray-50 p-3">
            <pre className="text-sm">
              {typeof response === "string"
                ? response
                : JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiEndpointCard;
